'use strict';

const root = document.querySelector('#root');

// const HTMLLiElements = responseData.filter((user) => user.firstName && user.id && user.description).map((user)=>createUserCard(user));

const HTMLLiElements = responseData.map((user) => createUserCard(user));

root.append(...HTMLLiElements);

function createUserCard(user) {
    const h3 = createElement(
        'h3',
        { classNames: ['cardName'] },
        document.createTextNode(user.firstName + user.lastName)
    );

    const lorem =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eius voluptas aut quos exercitationem, impedit saepe mollitia vitae nihil ipsum nam.';

    const p = createElement(
        'p',
        { classNames: ['cardDescription'] },
        document.createTextNode(user.description)
    );

    const article = createElement(
        'article',
        { classNames: ['cardConteiner'] },
        createImageWrapper(user),
        h3,
        p
    );

    return createElement('li', { classNames: ['cardWrapper'] }, article);
}

/**
 *
 * @param {string} type
 * @param {Object} options
 *  @param {sting[]} options.classNames
 *  @param {function} options.onClick
 * @param {object} options.attributes
 * @param {Node} children
 * @returns {HTMLElement}
 */
/*
Example ob ATTRIBUTES object
{
    src: 'https://links.com',
    alt: 'text',
    title: 'description',
}
const options = {
    classNames: [''],
    attributes: {
        href: '////',
        title: ''
    }
}
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

function createImageWrapper(user) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cardImageWrapper');
    imageWrapper.style.backgroundColor = stringToColor(user.firstName);
    imageWrapper.setAttribute('id', `wrapper${user.id}`);

    const initials = document.createElement('div');
    initials.classList.add('initials');
    initials.append(document.createTextNode(user.firstName[0] || ''));

    const imageOptions = {
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
    };

    createElement('img', imageOptions);

    imageWrapper.append(initials);

    return imageWrapper;
}

/* EVENT HANDLERS */

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
