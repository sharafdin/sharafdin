import { person, bottomCardContent, social, home, about, blog, work, gallery } from './content';
import { createI18nContent } from './content-i18n';
import { i18n } from './config';

const renderContent = (t) => {
    if ( i18n ) {
        return createI18nContent(t);
    } else {
        return {
            person,
            social,
            bottomCardContent,
            home,
            about,
            blog,
            work,
            gallery
        }
    }
};

export { renderContent };