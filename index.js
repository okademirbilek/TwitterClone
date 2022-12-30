import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

//Event Handlers
document.addEventListener('click', function(e){
    //data- attributes => unique id = e.target.dataset.like
    //like button
    if(e.target.dataset.like){
       //Calling functions with their IDs
       handleLikeClick(e.target.dataset.like) 
    }
     //Retweet button
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
     //Reply button
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
     //Tweet button
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    //Retweet button
    }else if (e.target.dataset.replytweet){
        handleReplyTweetBtnClick(e.target.dataset.replytweet)   
    }
})
 
//like
function handleLikeClick(tweetId){ 
    //Filtering over tweetsData   
    //Using the object inside the array indexed at 0
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    //If you already liked the tweet decrease the number 
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    //Inverse
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    //Calling the render function to show the changed values
    render()
}
//Retweet
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}
//Reply
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}
//Tweet
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    //Prevent sending empty tweets
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Okandemirbilek`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    //clear input area
    tweetInput.value = ''
    }

}


//Reply tweet
function handleReplyTweetBtnClick(tweetId){
    const replyTweetInput = document.getElementById(`reply-tweet-input-${tweetId}`)
    tweetsData.forEach(function(tweet){
       if(tweet.uuid === tweetId){
          if(replyTweetInput.value){
            tweet.replies.unshift({
                handle: `@okandemirbilek ✅`,
                profilePic: `images/tcruise.png`,
                tweetText: replyTweetInput.value
            })
            render()
            //clear input area
            replyTweetInput.value = ''
        } 
    } 
 })   

}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply,index){
                  const arrayLength=tweet.replies.length
                  if(index === arrayLength-1){
                      repliesHtml+=`
                        <div class="tweet-reply ">
                            <div class="tweet-inner lastIndex">
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                             <div class="reply-tweet-container">
                                <textarea 
                                placeholder="Reply tweet" 
                                class="reply-tweet-input"
                                id="reply-tweet-input-${tweet.uuid}"></textarea>
                                <button id="reply-tweet-btn"
                                data-replytweet="${tweet.uuid}"
                                >Tweet</button>
                             </div>
                        </div>
                        ` 
                      
                  }else{
                    repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `    
                  }
                  
                
                
            })
        }else if (tweet.replies.length === 0){
             repliesHtml+=`<div >
                                <textarea 
                                placeholder="Reply tweet"
                                class="reply-tweet-input" 
                                id="reply-tweet-input-${tweet.uuid}"></textarea>
                                <button id="reply-tweet-btn" 
                                data-replytweet="${tweet.uuid}"
                                
                                >Tweet</button>
                           </div>`
        }     
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

