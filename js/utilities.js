const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
});

const graphqlQueryFetch = async () => {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return data.data;
};

const createElement = (elem, className) => {
    const element = document.createElement(elem);
    element.setAttribute("class", className);
    return element;
};

const appendC = (element, ...children) => {
    children.forEach((child)=> {
        element.appendChild(child);
    });
    return element;
};

setTextOnElement = (element, text) => {
    appendC(element, document.createTextNode(text));
    return element;
};

createSVG = (pathDirection) => {
    const namespace = 'http://www.w3.org/2000/svg';

    let svg = document.createElementNS(namespace, "svg");
    svg.setAttributeNS(null,'class','fill-current mr-1');

    let path = document.createElementNS(namespace, "path");
    path.setAttributeNS(null, 'd', pathDirection);
    path.setAttribute('fill-rule', 'evenodd');

    svg.setAttribute('width', 16);
    svg.setAttribute('height', 16);
    svg.setAttribute('viewbox','0 0 16 16');

    appendC(svg, path);
    return svg;
};

class Repo {
    repoElement;

    constructor(repo) {
        this.repoElement = createElement('li', 'repo_box');
        const language = repo.language;
        const dataContainer = createElement('div', 'repo_detail');
        const star = createElement('div', 'repo_rating');
        const repoName = createElement('div', 'repo_name');
        const repoDesc = createElement('div','repo_desc');
        const repoMatrices = createElement('div','other_detail');
        const h3 = createElement('h3','font-bold');
        const a = createElement('a','break-all');
        const starButton = createElement('button','btn rating');
        const stbDiv = createElement('div','flex justify-end');
        setTextOnElement(a, repo.name);
        appendC(repoName, h3);
        appendC(h3, a);

        if(repo.description) {
            const p = createElement('p', 'repo_note');
            setTextOnElement(p, repo.description);
            appendC(repoDesc, p);
        }

        if(language){
            const colorIndicator = createElement('span','mr-3');
            const color = createElement('span','language-color-indicator inline-block mr-1 relative rounded-full');
            color.style.backgroundColor = language.color;
            color.style.display = 'inline-block';
            appendC(colorIndicator, color, setTextOnElement(createElement('span', 'break-all'), language.name));
            appendC(repoMatrices, colorIndicator);
        }

        if(repo.isPrivate){
            const label = createElement('span', 'private_repo');
            appendC(h3, setTextOnElement(label, 'Private'));
        }
        
        if(repo.forkCount > 0){
            const forks = createElement('a', '');
            appendC(forks, createSVG(SVG.FORK));
            setTextOnElement(forks, `${repo.forkCount}`);
            appendC(repoMatrices, forks);
        }

        if(repo.licenseInfo){
            const license = createElement('span', '');
            appendC(repoMatrices, setTextOnElement(appendC(license, createSVG(SVG.LICENSE)), ` ${repo.licenseInfo.name}`));
        }

        if(repo.stargazerCount > 0){
            const stars = createElement('a','mr-3 cursor-pointer flex-shrink-0');
            appendC(repoMatrices, setTextOnElement(appendC(stars,createSVG(SVG.STAR)),` ${repo.stargazerCount}`));
        }

        if(repo.updatedAt){
            const time = createElement('span', '');
            setTextOnElement(time, 'Updated');
            appendC(repoMatrices, appendC(time, setTextOnElement(createElement('span', ''),` ${repo.updatedAt}`)));
        }

        appendC(dataContainer, repoName, repoDesc, repoMatrices);
        appendC(star, appendC(stbDiv, setTextOnElement(appendC(starButton, createSVG(SVG.STAR)),' Star')));
        appendC(this.repoElement, dataContainer, star);
    }

    getElem(){
        return this.repoElement;
    }
}


function setPageVisibility(visible){
    document.querySelector('main').style.visibility = visible ? 'visible'  : 'hidden';
    document.querySelector('footer').style.visibility = visible ? 'visible'  : 'hidden';
}

//setPageVisibility(false);