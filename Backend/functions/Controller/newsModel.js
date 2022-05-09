const news = require("../API/API News")


async function getSportsNews({pageNumber,sportsID})
{
    try{
        if(sportsID == 0){
            var searchParams = "LaLiga  || Bundesliga || Premier League || Ligue 1 || Serie A || MLS"
        }else if(sportsID ==1){
            var searchParams = "NBA  || EuroLeague || EuroCup"
        }else if(sportsID ==2){
            var searchParams = "MLB ||  American League || National League"
        }else{
            var searchParams = "NHL ||  KHL || SHL"
        }
        let listOfArticles = await news.getNews({
                                    //page : pageNumber,
                                    lang : "en",
                                    //topic : "sport",
                                    q : searchParams
                                })
        let newsList = [pageNumber,listOfArticles]
        return {'code':100 , 'response': newsList}
    }catch(error){
        console.log("Error in getSportsNews().")
        console.log(error)
        return {'code':200 , 'error': 'Error retrieving news.', "response":[pageNumber,[]]}
    }
}

async function getArticlesByClub({pageNumber,clubName, leagueName}){
    try{
        let listOfArticles = await news.getNews({
                                    // page : pageNumber,
                                    lang : "en",
                                    // topic : "sport",
                                    q : clubName + " && " + leagueName
                                })
        let newsList = [pageNumber,listOfArticles]
        return {'code':100 , 'response': newsList}
    }catch(error){
        console.log("Error in getArticlesByClub().")
        console.log(error)
        return {'code':200 , 'error': 'Error retrieving news.', "response":[pageNumber,[]]}
    }
}

module.exports = {getArticlesByClub, getSportsNews}