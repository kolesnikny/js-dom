'use_strict';

/*
    по клику - выделять карточку рамкой. по выделению сохранить id вібраного пользователя в массив. 
    В хедере сайта рендерить имена вібраніх юзеров. Реализовать функционал удаления имен из єтого 
    спискаю Когда имя удаляется удалить подсвеку
*/

const SOCIAL_CONTACTS = new Map();
SOCIAL_CONTACTS.set('www.facebook.com', './assets/img/icons/facebook.svg');
SOCIAL_CONTACTS.set('www.instagram.com', './assets/img/icons/instagram.svg');
SOCIAL_CONTACTS.set('twitter.com', './assets/img/icons/twitter.svg');

const root = document.querySelector('#root');
const header = document.querySelector('h2');
// const HTMLLiElements = responseData
//     .filter((user) => user.firstName && user.lastName)
//     .map((user) => createUserCard(user));

// root.append(...HTMLLiElements);

fetch('./assets/js/constants/jsonData.json')
    .then((response) => {
        return response.json();
    })
    .then((jsonsArray) => {
        root.append(...jsonsArray.map((user) => createUserCard(user)));

    })
    .catch((error) => console.log(error));



/**
 *
 * @param {Object} user
 * @returns
 */
function createUserCard(user) {
    const cardName = createElement(
        'h3',
        {
            classNames: ['cardName'],
        },
        document.createTextNode(`${user.firstName}  ${user.lastName}`)
    );

    const lorem =
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio sed corrupti saepe. Dolores maiores dolor, quam ratione assumenda ea reiciendis.';
    const cardDescription = createElement(
        'p',
        {
            classNames: ['cardDescription,'],
        },
        document.createTextNode(lorem)
    );

    return createElement(
        'li',
        {
            classNames: ['cardWrapper'],
            eventListeners: {
                click: checkedCard,
            },
            attributes: {
                id: `user${user.id}`,
            },
        },
        createElement(
            'article',
            {
                classNames: ['cardConteiner'],
            },
            createImgWrapper(user),
            cardName,
            cardDescription,
            getContactsLinksList(user.contacts)
        )
    );
}


/**
 *
 * @param {string} type
 * @param {Object} options
 * @param {sting[]} options.classNames
 * @param {function} options.onClick
 * @param {object} options.attributes
 * @param {Node} children
 * @returns {HTMLElement}
 */

function createElement(
    type,
    { classNames = [], eventListeners = {}, attributes = {}, dataset = {} },
    ...children
) {
    const elem = document.createElement(type);
    elem.classList.add(...classNames);

    for (const [attrName, attrValue] of Object.entries(attributes)) {
        elem.setAttribute(attrName, attrValue);
    }

    for (const [key, value] of Object.entries(dataset)) {
        elem.dataset[key] = value;
    }

    for (const [type, handler] of Object.entries(eventListeners)) {
        elem.addEventListener(type, handler);
    }

    elem.append(...children);
    return elem;
}

/**
 *@description
 * @param {Object} contacts
 * @returns {HTMLElements} return <div> with image
 */
function createImgWrapper(user) {
    const initials = createElement(
        'div',
        {
            classNames: ['initials'],
        },
        document.createTextNode(user.firstName[0] || '')
    );

    createElement('img', {
        classNames: ['cardImage'],
        eventListeners: {
            error: handleImageError,
            load: handleImageLoad,
        },
        attributes: {
            src: user.profilePicture,
            alt: `${user.firstName} ${user.lastName}`,
        },
        dataset: {
            id: user.id,
        },
    });

    const imageWrapper = createElement(
        'div',
        {
            classNames: ['cardImageWrapper'],
            attributes: {
                id: `wrapper${user.id}`,
            },
        },
        initials
    );
    imageWrapper.style.backgroundColor = stringToColor(user.firstName);

    return imageWrapper;
}

/**
 *@description
 * @param {Array} contacts
 * @returns {HTMLElements} return <ul> with social links
 */
function getContactsLinksList(contacts) {
    const socialLinks = [];

    for (const url of contacts) {
        const img = createElement('img', {
            classNames: ['socialImg'],
            attributes: {
                src: SOCIAL_CONTACTS.get(new URL(url).hostname),
                alt: url,
            },
        });
        const a = createElement(
            'a',
            {
                attributes: {
                    href: url,
                },
            },
            img
        );
        const li = createElement(
            'li',
            {
                classNames: ['socialLink'],
            },
            a
        );

        socialLinks.push(li);
    }

    return createElement(
        'ul',
        { classNames: ['socialLinksConteiner'] },
        ...socialLinks
    );
}

function getHeaderData(){
    const headerNames = document.querySelectorAll('.cardWrapper-checked')
    let res = [];
    headerNames.forEach((item)=>{
        res.push(item.querySelector('h3').textContent);
    });
    return  res.length ? res.join(', ') : 'Users';
}



/* EVENT HANDLERS*/
function handleImageError({ target }) {
    target.remove();
}

function handleImageLoad(event) {
    const {
        target,
        target: {
            dataset: { id },
        },
    } = event;
    document.getElementById(`wrapper${id}`).append(target);
}

function checkedCard({ target }) {
    const element = document.getElementById(this.id);

    element.classList.toggle('cardWrapper-checked');
    header.textContent = getHeaderData();
}

/* Utils */
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}
