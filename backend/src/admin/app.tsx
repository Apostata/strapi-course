import Favicon from "./extensions/favicon.png";
export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      "en",
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      "pt-BR",
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    head: {
      favicon: Favicon,
    },
    tutorials: false,
    theme: {
      colors: {
        //light Theme
        buttonPrimary500: "#f00", //button hover
        buttonPrimary600: "#d9822f", //button
        primary500: "#f00", // secondary
        primary600: "#d9822f", // primary, active
        primary700: "#328048", //tertiary, calltoaction
      },
    },
    translations: {
      "pt-BR": {
        titleTemplate: "Painel Administrativo",
        "Auth.form.welcome.title": "Bem-vindo ao Painel Administrativo",
        "Auth.form.welcome.subtitle": "Faça login para continuar",
        "app.components.LeftMenu.navbrand.title": "Painel Administrativo",
        "global.localeToggle.label": "Idioma",
        "cloud.plugin.name": "Cloud",
      },
      en: {
        titleTemplate: "Admin Panel",
        "Auth.form.welcome.title": "Welcome to the Admin Panel",
        "Auth.form.welcome.subtitle": "Login to continue",
        "app.components.LeftMenu.navbrand.title": "Admin Panel",
        "global.localeToggle.label": "Language",
        "cloud.plugin.name": "Cloud",
      },
    },
  },
  bootstrap(app: any) {
    document.title = "admin panel";
    console.log(app);
  },
};
