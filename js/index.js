const menuDropdown = document.getElementById('menu_dropdown');
const profilePics = document.querySelectorAll('.profilePic')[2];
const profileNames = document.querySelectorAll('.profile_name');
const fullName = document.querySelector('.profile_name');
const detailName = document.querySelector('.sidebar .profile_detail');
const stickyBar = document.querySelector('.sticky-bar');
const followingCount = document.querySelector('.following-count');
const followersCount = document.querySelector('.followers-count');
const starsCount = document.querySelector('.stars-count');
const repoCount = document.querySelector('.repo-count');
const list = document.querySelector('.repo_wrapper');
const profilePic = document.getElementById('profilePic');
const stickyPic = document.getElementById('pic_hidden');
const smProfilePic = document.getElementById('sm_profilePic');

menuDropdown.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.style.display = (menu.style.display === "none") ? "block" : "none";
});

const fetchDetails = async () => {
    try {
        const response = await graphqlQueryFetch();

        const { user } = await response;
        
        if(user) {
            const data = {
                repositories: user.repositories.nodes.map(node=>{
                    const { primaryLanguage, description, isPrivate, name, forkCount, isFork, licenseInfo, stargazerCount, updatedAt} = node;
                    return {
                        language: primaryLanguage,
                        description,
                        isFork,
                        name,
                        licenseInfo,
                        isPrivate,
                        forkCount,
                        stargazerCount,
                        updatedAt
                    };
                }),
                profilePics: user.avatarUrl,
                stickyPic: user.avatarUrl,
                profileNames: [user.login],
                following: user.following.totalCount,
                followers: user.followers.totalCount,
                starredRepositories: user.starredRepositories.totalCount
            };
            
            return data;
        }
    }catch(err) {
        throw new Error(err);
    }
};

function updateRepoList(repositories) {
    repositories.forEach(repo=> {
        appendC(list, new Repo(repo).getElem());
    });
    console.log(repositories);
}

async function main(){
    try{
        const data = await fetchDetails();
        console.log(data);

        if(data){
            let { repositories, following, username, followers, starredRepositories } = data;
            updateRepoList(repositories);
            smProfilePic.src = data.profilePics;
            /* profilePics.forEach(image => {
                image.src = data.profilePics;
            }); */
            //stickyPic.src = data.stickyPic;
            profilePic.src = data.profilePics;
            profileNames.forEach(name => {
                setTextOnElement(name, username);
            });
            setTextOnElement(followingCount, following);
            setTextOnElement(followersCount, followers);
            setTextOnElement(starsCount, starredRepositories);
            setTextOnElement(fullName, username);
            setTextOnElement(repoCount, repositories.length);
            setPageVisibility(true);
        }
    }catch(e){
        console.error("ERROR", e);
    }

    //Observe Name Element
    const nameObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry=> {
            console.log(entry);
            console.log(stickyBar);
            if(entry.target.intersectionRatio > 0.1) {
                stickyBar.style.visibility = "hidden";
            }
            if(entry.intersectionRatio > 0.3){
                stickyBar.style.display = "visible"; 
            }
        });
    }, {
        root: stickyBar,
        rootMargin: '-67px 0px 0px 0px',
        threshold: 0.5
    });

    nameObserver.observe(detailName);

    menuDropdown.addEventListener('click',function(e){
        if(navigation.classList.contains('open')) {
            navigation.classList.remove('open');
        } else {
            navigation.classList.add('open');
        }
    });
}

main();