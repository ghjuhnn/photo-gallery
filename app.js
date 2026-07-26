/**
 * 有志青年摄影 - 摄影作品集 H5 应用
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
    // 从本地存储加载已删除的内置作品 id
    const deletedPhotoIds = ref(new Set(JSON.parse(localStorage.getItem('photo_deleted_builtin') || '[]')));
    // 合并内置（排除已删除） + 用户上传
    const allPhotos = computed(() => [
      ...userPhotos.value,
      ...photos.value.filter(p => !deletedPhotoIds.value.has(p.id))
    ]);

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
    // 多图浏览：当前作品内的图片索引
    const currentPhotoImgIdx = ref(0);
    const multiImgEls = ref({}); // { photoIdx: el }

    // 上传表单
    const uploadForm = reactive({
      images: [],
      title: '',
      desc: '',
      location: '',
      category: 'portrait'
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
      uploadForm.images.length > 0 && uploadForm.title.trim()
    );

    // ============ 图片 URL 生成 ============
    // 获取作品的所有图片缩略图（支持多图）
    function getThumbUrls(photo) {
      if (photo.images && photo.images.length) {
        return photo.images;
      }
      if (photo.seeds && photo.seeds.length) {
        return photo.seeds.map(s => `https://picsum.photos/seed/${s}/400/600`);
      }
      return [getThumbUrl(photo)];
    }

    // 获取作品的所有大图（支持多图）
    function getFullUrls(photo) {
      if (photo.images && photo.images.length) {
        return photo.images;
      }
      if (photo.seeds && photo.seeds.length) {
        return photo.seeds.map(s => `https://picsum.photos/seed/${s}/1080/1620`);
      }
      return [getFullUrl(photo)];
    }

    // 获取首张缩略图（用于卡片展示）
    function getThumbUrl(photo) {
      if (photo.images && photo.images.length) return photo.images[0];
      if (photo.seeds && photo.seeds.length) return `https://picsum.photos/seed/${photo.seeds[0]}/400/600`;
      if (photo.seed) return `https://picsum.photos/seed/${photo.seed}/400/600`;
      return photo.imageUrl || photo.image || '';
    }

    // 获取首张大图
    function getFullUrl(photo) {
      if (photo.images && photo.images.length) return photo.images[0];
      if (photo.seeds && photo.seeds.length) return `https://picsum.photos/seed/${photo.seeds[0]}/1080/1620`;
      if (photo.seed) return `https://picsum.photos/seed/${photo.seed}/1080/1620`;
      return photo.imageUrl || photo.image || '';
    }

    // 获取作品图片数量
    function getPhotoCount(photo) {
      if (photo.images && photo.images.length) return photo.images.length;
      if (photo.seeds && photo.seeds.length) return photo.seeds.length;
      return 1;
    }

    // 当前浏览作品的所有大图
    const currentPhotoImgs = computed(() => {
      const photo = viewerPhotos.value[viewerIndex.value];
      return photo ? getFullUrls(photo) : [];
    });

    // 多图滑动容器引用收集
    function setMultiImgScroll(el, idx) {
      if (el) multiImgEls.value[idx] = el;
    }

    // 多图内部滑动监听
    function onMultiImgScroll(e, idx) {
      if (idx !== viewerIndex.value) return;
      const el = e.target;
      const slideWidth = el.offsetWidth;
      const imgIdx = Math.round(el.scrollLeft / slideWidth);
      if (imgIdx !== currentPhotoImgIdx.value && imgIdx >= 0) {
        currentPhotoImgIdx.value = imgIdx;
      }
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
      currentPhotoImgIdx.value = 0;
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
      currentPhotoImgIdx.value = 0;
    }

    function onViewerScroll() {
      if (!swiperEl.value) return;
      const slideWidth = swiperEl.value.offsetWidth;
      const idx = Math.round(swiperEl.value.scrollLeft / slideWidth);
      if (idx !== viewerIndex.value && idx >= 0 && idx < viewerPhotos.value.length) {
        viewerIndex.value = idx;
        currentPhotoImgIdx.value = 0;
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

    // ============ 删除作品 ============
    function deletePhoto(id) {
      // 找到要删除的作品
      const photo = allPhotos.value.find(p => p.id === id);
      if (!photo) return;

      // 二次确认
      if (!confirm(`确定要删除「${photo.title}」吗？`)) return;

      // 判断是用户上传的还是内置的
      const isUserUpload = userPhotos.value.some(p => p.id === id);

      if (isUserUpload) {
        // 删除用户上传的作品
        userPhotos.value = userPhotos.value.filter(p => p.id !== id);
        localStorage.setItem('photo_user_uploads', JSON.stringify(userPhotos.value));
      } else {
        // 标记内置作品为已删除
        const newSet = new Set(deletedPhotoIds.value);
        newSet.add(id);
        deletedPhotoIds.value = newSet;
        localStorage.setItem('photo_deleted_builtin', JSON.stringify([...newSet]));
      }

      // 同时清除该作品的点赞和收藏
      const newLiked = new Set(likedIds.value);
      newLiked.delete(id);
      likedIds.value = newLiked;
      localStorage.setItem('photo_liked', JSON.stringify([...newLiked]));

      const newCollected = new Set(collectedIds.value);
      newCollected.delete(id);
      collectedIds.value = newCollected;
      localStorage.setItem('photo_collected', JSON.stringify([...newCollected]));

      showToast('已删除');
      closeViewer();
    }

    // ============ 上传 ============
    function goUpload() {
      uploadForm.images = [];
      uploadForm.title = '';
      uploadForm.desc = '';
      uploadForm.location = '';
      uploadForm.category = 'portrait';
      uploadOpen.value = true;
    }

    function closeUpload() {
      uploadOpen.value = false;
    }

    function onImageSelect(e) {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      const remain = 9 - uploadForm.images.length;
      if (remain <= 0) {
        showToast('最多只能上传 9 张图片');
        e.target.value = '';
        return;
      }
      const toRead = files.slice(0, remain);
      if (files.length > remain) {
        showToast(`最多 9 张，已选前 ${remain} 张`);
      }
      toRead.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          showToast('单张图片不能超过 10MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadForm.images.push(ev.target.result);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }

    function removeUploadImage(idx) {
      uploadForm.images.splice(idx, 1);
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
        images: [...uploadForm.images],
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
      currentPhotoImgIdx,
      currentPhotoImgs,
      getThumbUrl,
      getFullUrl,
      getThumbUrls,
      getFullUrls,
      getPhotoCount,
      setMultiImgScroll,
      onMultiImgScroll,
      getCategoryName,
      openViewer,
      closeViewer,
      onViewerScroll,
      isLiked,
      isCollected,
      toggleLike,
      toggleCollect,
      deletePhoto,
      goUpload,
      closeUpload,
      onImageSelect,
      removeUploadImage,
      publish,
      openSearch
    };
  }
}).mount('#app');
