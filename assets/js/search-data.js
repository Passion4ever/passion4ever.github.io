// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-主页",
    title: "主页",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-论文",
          title: "论文",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "news-硕士毕业了-tada",
          title: '硕士毕业了! :tada:',
          description: "",
          section: "News",},{id: "news-研究生基础技能",
          title: '研究生基础技能',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_top/";
            },},];
