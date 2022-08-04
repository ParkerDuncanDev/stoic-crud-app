const likeButton = document.querySelectorAll('.fa-thumbs-up')
const deleteButton = document.querySelectorAll('.fa-trash-can')


Array.from(likeButton).forEach((element) => {
    element.addEventListener('click', addLike)
})

Array.from(deleteButton).forEach((element) => {
    element.addEventListener('click', deleteQuote)
})

async function addLike(){
    const nameText = this.parentNode.childNodes[1].innerText

    const quoteText = this.parentNode.childNodes[3].innerText
 
    const tLikes = (Number(this.parentNode.childNodes[7].innerText)) + 1
 
    console.log(JSON.stringify({
        name: nameText,
        quote: quoteText,
        likes: tLikes
    }))

    try{
        const response = await fetch('addlike', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'name': nameText,
                'quote': quoteText,
                'likes': tLikes
            })
        })
        const data = await response.json
        console.log(data)
        location.reload()
        
    }catch(err){
        console.log('error happened here')
        console.log(err)
    }

}

async function deleteQuote(){
    const nameText = this.parentNode.childNodes[1].innerText
    
    const quoteText = this.parentNode.childNodes[3].innerText
    console.log('deleting ' +nameText + quoteText)

    try{
        const response = await fetch('deletequote', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: nameText,
                quote: quoteText,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
        
    }catch(err){
        console.log(err)
    }
}
