/**
 * 光影集 - 摄影作品集 H5 应用
 * Vue 3 Composition API
 */
const { createApp, ref, computed, reactive, nextTick, on } = Vue;

createApp({
  setup() {
    // ============ 数据 ============
    const categories = ref([...window.PHOTO_DATA.categories]);
    const photos = ref([...window.PHOTO_DATA.photos]);

    // 从本地存储加载用户上传的作品
    const userPhotos = ref(JSON.parse(localStorage.getItem('photo_user_uploads') || '[]'));
    // 合并内置 + 用户上传
    const allPhotos = computed(() => [...userPhotos.value, ...photos.value]);

    // 收藏列表
    const likedIds = ref(new Set(JSON.parse(localStorage.getItem('photo_liked') || '[]')));
    const collectedIds = ref(new Set(JSON.parse(localStorage.getItem('photo_collected') || '[]')));

    // ============ 页面状态 ============
    const currentPage = ref('home'); // home | mine
    const activeCategory = ref('all');
    const viewerOpen = ref(false);
    const viewerIndex = ref(0);
    const viewerStartId = ref(null);
    const uploadOpen = ref(false);
    const toastMsg = ref('');
    const swiperEl = ref(null);

    // 上传表单
    const uploadForm = reactive({
      image: '',
      title: '',
      desc: '',
      location: '',
      category: 'landscape'
    });

    // ============ 计算属性 ============
    const filteredPhotos = computed(() => {
      if (activeCategory.value === 'all') return allPhotos.value;
      return allPhotos.value.filter(p => p.category === activeCategory.value);
    });

    const viewerPhotos = computed(() => {
      if (activeCategory.value === 'all') return allPhotos.value;
      return allPhotos.value.filter(p => p.category === activeCategory.value);
    });

    const myPhotos = computed(() => userPhotos.value.map(p => ({
      ...p,
      categoryName: getCategoryName(p.category)
    })));

    const likedPhotos = computed(() =>
      allPhotos.value.filter(p => likedIds.value.has(p.id))
    );

    const canPublish = computed(() =>
      uploadForm.image && uploadForm.title.trim()
    );

    // ============ 图片 URL 生成 ============
    function getThumbUrl(photo) {
      if (photo.seed) {
        return `https://picsum.photos/seed/${photo.seed}/400/600`;
      }
      return photo.imageUrl || photo.image;
    }

    function getFullUrl(photo) {
      if (photo.seed) {
        return `https://picsum.photos/seed/${photo.seed}/1080/1620`;
      }
      return photo.imageUrl || photo.image;
    }

    function getCategoryName(catId) {
      const cat = categories.value.find(c => c.id === catId);
      return cat ? cat.name : '未分类';
    }

    // ============ 大图浏览 ============
    function openViewer(photoId) {
      const idx = viewerPhotos.value.findIndex(p => p.id === photoId);
      if (idx === -1) return;
      viewerStartId.value = photoId;
      viewerIndex.value = idx;
      viewerOpen.value = true;

      nextTick(() => {
        if (swiperEl.value) {
          const slideWidth = swiperEl.value.offsetWidth;
          swiperEl.value.scrollTo({ left: idx * slideWidth, behavior: 'instant' });
        }
      });
    }

    function closeViewer() {
      viewerOpen.value = false;
    }

    function onViewerScroll() {
      if (!swiperEl.value) return;
      const slideWidth = swiperEl.value.offsetWidth;
      const idx = Math.round(swiperEl.value.scrollLeft / slideWidth);
      if (idx !== viewerIndex.value && idx >= 0 && idx < viewerPhotos.value.length) {
        viewerIndex.value = idx;
      }
    }

    // ============ 点赞 & 收藏 ============
    function isLiked(id) { return likedIds.value.has(id); }
    function isCollected(id) { return collectedIds.value.has(id); }

    function toggleLike(id) {
      const newSet = new Set(likedIds.value);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      likedIds.value = newSet;
      localStorage.setItem('photo_liked', JSON.stringify([...newSet]));
    }

    function toggleCollect(id) {
      const newSet = new Set(collectedIds.value);
      if (newSet.has(id)) {
        newSet.delete(id);
        showToast('已取消收藏');
      } else {
        newSet.add(id);
        showToast('已加入收藏');
      }
      collectedIds.value = newSet;
      localStorage.setItem('photo_collected', JSON.stringify([...newSet]));
    }

    // ============ 上传 ============
    function goUpload() {
      uploadForm.image = '';
      uploadForm.title = '';
      uploadForm.desc = '';
      uploadForm.location = '';
      uploadForm.category = 'landscape';
      uploadOpen.value = true;
    }

    function closeUpload() {
      uploadOpen.value = false;
    }

    function onImageSelect(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        showToast('图片不能超过 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        uploadForm.image = ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    function publish() {
      if (!canPublish.value) return;
      const newPhoto = {
        id: Date.now(),
        title: uploadForm.title.trim(),
        author: '我',
        category: uploadForm.category,
        location: uploadForm.location.trim() || '未知地点',
        desc: uploadForm.desc.trim(),
        likes: 0,
        image: uploadForm.image,
        createdAt: Date.now()
      };
      userPhotos.value.unshift(newPhoto);
      localStorage.setItem('photo_user_uploads', JSON.stringify(userPhotos.value));
      showToast('发布成功！');
      uploadOpen.value = false;
      currentPage.value = 'mine';
    }

    // ============ 其他 ============
    function openSearch() {
      showToast('搜索功能开发中...');
    }

    let toastTimer = null;
    function showToast(msg) {
      toastMsg.value = msg;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toastMsg.value = ''; }, 2000);
    }

    return {
      categories,
      photos,
      filteredPhotos,
      viewerPhotos,
      myPhotos,
      likedPhotos,
      currentPage,
      activeCategory,
      viewerOpen,
      viewerIndex,
      uploadOpen,
      uploadForm,
      canPublish,
      toastMsg,
      swiperEl,
      getThumbUrl,
      getFullUrl,
      getCategoryName,
      openViewer,
      closeViewer,
      onViewerScroll,
      isLiked,
      isCollected,
      toggleLike,
      toggleCollect,
      goUpload,
      closeUpload,
      onImageSelect,
      publish,
      openSearch
    };
  }
}).mount('#app');
