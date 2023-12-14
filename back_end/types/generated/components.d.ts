import type { Schema, Attribute } from '@strapi/strapi';

export interface BlogPostSelections extends Schema.Component {
  collectionName: 'components_blog_post_selections';
  info: {
    displayName: 'postSelections';
    icon: 'apps';
  };
  attributes: {
    heading: Attribute.String;
    featurePosts: Attribute.Relation<
      'blog.post-selections',
      'oneToOne',
      'api::post.post'
    >;
  };
}

export interface ConfigSocialLink extends Schema.Component {
  collectionName: 'components_config_social_links';
  info: {
    displayName: 'socialLink';
    icon: 'link';
  };
  attributes: {
    socialMedia: Attribute.Enumeration<
      ['github', 'linkedin', 'facebook', 'youtube']
    > &
      Attribute.Required;
    link: Attribute.String & Attribute.Required;
  };
}

export interface LayoutFeaturedCourse extends Schema.Component {
  collectionName: 'components_layout_featured_courses';
  info: {
    displayName: 'FeaturedCourse';
    icon: 'expand';
  };
  attributes: {
    course: Attribute.Relation<
      'layout.featured-course',
      'oneToOne',
      'api::course.course'
    >;
  };
}

export interface LayoutHeaderSection extends Schema.Component {
  collectionName: 'components_layout_header_sections';
  info: {
    displayName: 'header';
    icon: 'layout';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    image: Attribute.Media;
    buttons: Attribute.Component<'layout.link', true>;
  };
}

export interface LayoutLink extends Schema.Component {
  collectionName: 'components_layout_links';
  info: {
    displayName: 'link';
    icon: 'cursor';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface LayoutMissionComponent extends Schema.Component {
  collectionName: 'components_layout_mission_components';
  info: {
    displayName: 'missionComponent';
    icon: 'handHeart';
  };
  attributes: {
    heading: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Our Mission'>;
    content: Attribute.Text & Attribute.Required;
    showLogo: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
  };
}

export interface LayoutNewsletterForm extends Schema.Component {
  collectionName: 'components_layout_newsletter_forms';
  info: {
    displayName: 'newsletterForm';
  };
  attributes: {
    heading: Attribute.String & Attribute.Required;
    subHeading: Attribute.Text;
  };
}

export interface LayoutPageBaseArchitecture extends Schema.Component {
  collectionName: 'components_layout_page_base_architectures';
  info: {
    displayName: 'pageBaseArchitecture';
    icon: 'dashboard';
  };
  attributes: {
    content: Attribute.RichText & Attribute.Required;
    coverImage: Attribute.Media;
    seoPageInfo: Attribute.Component<'seo.seo-information'>;
  };
}

export interface LayoutServices extends Schema.Component {
  collectionName: 'components_layout_services';
  info: {
    displayName: 'ServicesPreview';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    services: Attribute.Relation<
      'layout.services',
      'oneToMany',
      'api::service.service'
    >;
  };
}

export interface SeoSeoInformation extends Schema.Component {
  collectionName: 'components_seo_seo_informations';
  info: {
    displayName: 'SeoInformation';
    icon: 'search';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blog.post-selections': BlogPostSelections;
      'config.social-link': ConfigSocialLink;
      'layout.featured-course': LayoutFeaturedCourse;
      'layout.header-section': LayoutHeaderSection;
      'layout.link': LayoutLink;
      'layout.mission-component': LayoutMissionComponent;
      'layout.newsletter-form': LayoutNewsletterForm;
      'layout.page-base-architecture': LayoutPageBaseArchitecture;
      'layout.services': LayoutServices;
      'seo.seo-information': SeoSeoInformation;
    }
  }
}
