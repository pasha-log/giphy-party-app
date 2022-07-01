const $gifArea = $('#gif-area')
const $searchInput = $('#search')

function getGif(res){
    let numResults = res.data.length;
    if (numResults){
        let $newCol = $('<div>')
        let numberIdx = Math.floor(Math.random()*numResults);
        let $newGif = $('<img>', {src: res.data[numberIdx].images.original.url})
        $newCol.append($newGif);
        $gifArea.append($newCol);
    }
}

$('#searchform').on('submit', async function(evt){
    evt.preventDefault();
    let searchTerm = $searchInput.val()
    $searchInput.val("");
    const url = `https://api.giphy.com/v1/gifs/search?api_key=49mYM1rhLa3qf15W7OmaLgSZlMzZo2nE&q=${searchTerm}&limit=25&offset=0&rating=r&lang=en`
    const response = await axios.get(url)
    getGif(response.data)
})

$('#remove').on('click', function(){
    $gifArea.empty();
})
