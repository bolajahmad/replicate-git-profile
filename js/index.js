const menuDropdown = document.getElementById('menu_dropdown');
const profilePics = document.querySelectorAll('.profile_pic');
const profileNames = document.querySelectorAll('.username');
const fullName = document.querySelector('.profile_name');
const detailName = document.querySelector('.sidebar .profile_detail');
const followingCount = document.querySelector('.following-count');
const followersCount = document.querySelector('.followers-count');
const starsCount = document.querySelector('.stars-count');
const repoCount = document.querySelector('.repo-count');
const list = document.querySelector('.repo_wrapper');

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
                image: user.avatarUrl,
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
}

async function main(){
    try{
        const data = await fetchDetails();

        if(data){
            let { repositories, following, image, followers, starredRepositories } = data;
            updateRepoList(repositories);
            profilePics.forEach(pic => {
                pic.src = image;
            });
            /* stickyPic.src = data.profilePics;
            smProfilePic.src = data.profilePics;
            lgProfilePic.src = data.profilePics;
            profilePic.src = data.profilePics;
            dropdownPic.src = data.profilePics; */
            profileNames.forEach(name => {
                setTextOnElement(name, data.profileNames[0]);
            });
            setTextOnElement(followingCount, following);
            setTextOnElement(followersCount, followers);
            setTextOnElement(starsCount, starredRepositories);
            setTextOnElement(repoCount, repositories.length);
            setPageVisibility(true);
        }
    }catch(e){
        console.error("ERROR", e);
    }

    //Observe Name Element
    const nameObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry=> {
            console.log(entry.intersectionRatio);
            if(!entry.isIntersecting) {
                document.getElementById('sticky_bar').style.visibility = "hidden";
            } else {
                document.getElementById('sticky_bar').style.visibility = "visible"; 
            }
        });
    }, {
        root: document.getElementById('sticky_bar'),
    });

    nameObserver.observe(document.getElementById('sidebar'));

    /* menuDropdown.addEventListener('click',function(e){
        if(navigation.classList.contains('open')) {
            navigation.classList.remove('open');
        } else {
            navigation.classList.add('open');
        }
    }); */
}

main();