/**
 * 摄影作品集 - 示例数据
 * 图片来源: picsum.photos (公开随机图片服务)
 */

window.PHOTO_DATA = {
  categories: [
    { id: 'all', name: '全部', icon: '🖼️' },
    { id: 'portrait', name: '写真', icon: '📸' },
    { id: 'wedding', name: '婚纱', icon: '💍' },
    { id: 'family', name: '亲子', icon: '👨‍👩‍👧' },
    { id: 'kids', name: '儿童', icon: '🧸' },
    { id: 'ceremony', name: '婚礼', icon: '💐' },
    { id: 'fitting', name: '试妆', icon: '💄' }
  ],

  photos: [
    {
      id: 1,
      title: '光影之间',
      author: '林深',
      category: 'portrait',
      location: '798艺术区，北京',
      desc: '自然光下的少女写真，侧脸的轮廓被夕阳勾出金边，无需多余修饰。',
      likes: 328,
      seed: 'portrait-soft-01'
    },
    {
      id: 2,
      title: '白纱之约',
      author: '陈一',
      category: 'wedding',
      location: '外滩，上海',
      desc: '海风吹起头纱的瞬间，是她最美的样子。定格这一刻的悸动。',
      likes: 489,
      seed: 'wedding-veil-01'
    },
    {
      id: 3,
      title: '母女时光',
      author: '阿默',
      category: 'family',
      location: '中山公园',
      desc: '妈妈低头亲吻女儿的额头，阳光穿过树叶洒在她们身上，温柔得像一幅画。',
      likes: 415,
      seed: 'family-kiss-01'
    },
    {
      id: 4,
      title: '小小探险家',
      author: '微光',
      category: 'kids',
      location: '植物园',
      desc: '三岁的他对每片叶子都充满好奇，镜头追着他跑了一整个下午。',
      likes: 267,
      seed: 'kids-explore-01'
    },
    {
      id: 5,
      title: '交换誓约',
      author: '陈一',
      category: 'ceremony',
      location: '教堂，青岛',
      desc: '他说"我愿意"时，她的眼泪终于落下来。这是整场婚礼最珍贵的一秒。',
      likes: 532,
      seed: 'wedding-vow-01'
    },
    {
      id: 6,
      title: '第一套妆造',
      author: '梁柱',
      category: 'fitting',
      location: '婚纱工作室',
      desc: '化妆师为她点上最后一抹唇色的瞬间，她看着镜子里的自己，愣住了。',
      likes: 376,
      seed: 'fitting-makeup-01'
    },
    {
      id: 7,
      title: '逆光少女',
      author: '林深',
      category: 'portrait',
      location: '芦苇荡',
      desc: '秋日芦苇荡里的逆光写真，发丝透着光，眼神里有故事。',
      likes: 445,
      seed: 'portrait-backlight-01'
    },
    {
      id: 8,
      title: '湖畔誓言',
      author: '陈一',
      category: 'wedding',
      location: '西湖，杭州',
      desc: '湖面倒映着白纱与远山，新人的剪影定格成一幅水墨画。',
      likes: 503,
      seed: 'wedding-lake-01'
    },
    {
      id: 9,
      title: '爸爸的肩膀',
      author: '阿默',
      category: 'family',
      location: '海边',
      desc: '骑在爸爸肩头看海的瞬间，孩子的笑声比海浪还清脆。',
      likes: 312,
      seed: 'family-shoulder-01'
    },
    {
      id: 10,
      title: '气球与笑脸',
      author: '微光',
      category: 'kids',
      location: '社区花园',
      desc: '一束彩色气球换来的纯真笑容，是童年最真实的模样。',
      likes: 298,
      seed: 'kids-balloon-01'
    },
    {
      id: 11,
      title: '花瓣雨',
      author: '陈一',
      category: 'ceremony',
      location: '户外草坪',
      desc: '新人走出仪式时，花瓣如雨般落下。所有人都在欢呼，而他们只看着彼此。',
      likes: 487,
      seed: 'ceremony-petals-01'
    },
    {
      id: 12,
      title: '试妆日记',
      author: '梁柱',
      category: 'fitting',
      location: '高定工作室',
      desc: '第三套妆造，她对着镜子转了一圈又一圈，眼里闪着光。这就是最美的时刻。',
      likes: 258,
      seed: 'fitting-mirror-01'
    },
    {
      id: 13,
      title: '窗边心事',
      author: '林深',
      category: 'portrait',
      location: '老洋房',
      desc: '靠在窗边的个人写真，午后光线柔和，适合记录一些安静的情绪。',
      likes: 391,
      seed: 'portrait-window-01'
    },
    {
      id: 14,
      title: '古城婚纱',
      author: '陈一',
      category: 'wedding',
      location: '平遥古城，山西',
      desc: '红墙青瓦间的白纱，中式与西式的碰撞，别有一番韵味。',
      likes: 421,
      seed: 'wedding-ancient-01'
    },
    {
      id: 15,
      title: '三代同框',
      author: '阿默',
      category: 'family',
      location: '老家院子',
      desc: '奶奶、妈妈和女儿，三代人的手叠在一起。时光在这一刻变得温柔。',
      likes: 567,
      seed: 'family-three-gen-01'
    },
    {
      id: 16,
      title: '生日快乐',
      author: '微光',
      category: 'kids',
      location: '家里',
      desc: '两岁生日的烛光映在小脸上，她认真地许愿，吹蜡烛的瞬间被定格。',
      likes: 334,
      seed: 'kids-birthday-01'
    },
    {
      id: 17,
      title: '第一支舞',
      author: '陈一',
      category: 'ceremony',
      location: '宴会厅',
      desc: '灯光暗下，追光打在旋转的两人身上。这是属于他们的第一支舞。',
      likes: 402,
      seed: 'ceremony-dance-01'
    },
    {
      id: 18,
      title: '镜中新娘',
      author: '梁柱',
      category: 'fitting',
      location: '化妆间',
      desc: '最后一笔定妆，她深吸一口气。镜子里那个闪闪发光的人，就是今天的新娘。',
      likes: 349,
      seed: 'fitting-bride-01'
    }
  ]
};
