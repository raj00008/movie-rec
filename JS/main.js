let app = {
    input: null,
    baseURL: 'https://api.themoviedb.org/3/',
    configData: null,
    baseImageURL: null,
    backButton: null,
    init: function () {
        // fetch the config info
        app.input = document.getElementById('search-input');
        app.input.focus();
        
        app.backButton=document.getElementById('back-button');
        

        //add click listener
        // listen for enter or return
        
        let btn = document.getElementById('search-button');
        btn.addEventListener('click', app.fetchData);
        //listen for enter or return
        document.addEventListener('keypress', function(ev){
            let char =ev.char || ev.charCode || ev.which;
            if(char== 10 || char==13){
                //they hit <enter> or <return>
                btn.dispatchEvent(new MouseEvent('click'));
            }
        })
    },
    fetchData: function(ev){
        let url = `${app.baseURL}configuration?api_key=${APIKEY}`;
        fetch(url)
        .then((result)=>{
            return result.json();
        })
        .then((data)=>{
            console.log(data);
            app.baseImageURL= data.images.secure_base_url;
            app.configData= data.images;
            return app.runSearch();
        })
        .catch(err =>{
            console.log("Something went wrong:",err);
        })
        
    },
    //do the fetch to get the list of movies
    runSearch: function(ev){

        if (app.input.value){
           
  
            let url = `${app.baseURL}search/movie?api_key=${APIKEY}&query=${app.input.value}`;
            console.log(url);

            
            fetch(url)
            .then(response => response.json() )
            .then(data => {
                console.log(data);
                app.showMovies(data);
            })
           
            
            .catch( err => {
               console.log(err); 
            });
            
        }
    },
    //Function to show movies.
    showMovies: function(movies){
        let section = document.querySelector('#search-results .content');
        let df = document.createDocumentFragment();
        section.innerHTML= "";
        let h2=document.createElement('h2');
        df.appendChild(h2);
        h2.className='title';
        h2.textContent='There were '+movies.results.length+' results found for: '+app.input.value;  
    
        movies.results.forEach((movie)=>{
            let searchDiv=document.createElement('div');
            let h2=document.createElement('h2')
            let overView=document.createElement('p');
            let img=document.createElement('img');
            let div2=document.createElement('div');
            img.alt=movie.title;
            img.className="img";
            searchDiv.setAttribute('data-movie', movie.id);
            searchDiv.addEventListener('click', app.getRecommend);
            searchDiv.classList.add('movie');
            overView.textContent=movie.overview;
            overView.className='font';
            h2.textContent=movie.title;
            h2.className='font';
            img.src =app.baseImageURL+'w185'+movie.poster_path;
            searchDiv.appendChild(img);
            div2.appendChild(h2);
            div2.appendChild(overView);
            searchDiv.appendChild(div2);
            df.appendChild(searchDiv);
        });
        section.appendChild(df);
        app.backButton.addEventListener('click', function(){
            section.innerHTML="";
            location.reload(); 
                                  })
      
    },
    getRecommend: function(recommend){
        let movie_id=recommend.currentTarget.getAttribute('data-movie');

        let url = `${app.baseURL}movie/${movie_id}/recommendations?api_key=${APIKEY}`;
            console.log(url);
        let sr = document.querySelector('#search-results .content');
        fetch(url)
        .then(response=>response.json())
        .then((data)=>{
            console.log(data);
             if(data.results==0){
            sr.innerHTML='';
            let error=document.createElement('p');
            error.textContent='Sorry! There were no recommendations found for this title';
            sr.appendChild(error);
            sr.className='head';
        }else{
            console.log(movie_id);
            sr.innerHTML="";
            app.showRecommend(data);
            
        }
        })
        .catch(err=>
        console.log(err))  
        
    },
    showRecommend: function(recommendations){
        let resection=document.getElementById('recommend-results');
        resection.innerHTML= '';
        let df=document.createDocumentFragment();
        let h2=document.createElement('h2');
        h2.className="title";
        h2.textContent='There were '+recommendations.total_results+" recommendations for this movie."
        df.appendChild(h2);
        recommendations.results.forEach((movie)=>{
        let div=document.createElement('div');
        div.classList.add('movie');
        let h2=document.createElement('h2');
        let overview=document.createElement('p');

        let img=document.createElement('img');
        img.alt=movie.title;
        let div2=document.createElement('div');
        img.className="img";
        h2.textContent=movie.title;
        h2.className='font';

        overview.textContent=movie.overview;
        img.src=app.baseImageURL+"w185"+movie.poster_path;
        div.appendChild(img);
        div2.appendChild(h2);
        div2.appendChild(overview);
        div.appendChild(div2);
        df.appendChild(div);
            });
        resection.appendChild(df);
        app.backButton.addEventListener('click', function(){
        resection.innerHTML="";
            location.reload(); 
                                  })
    }
};

document.addEventListener('DOMContentLoaded', app.init);

//wait for DOMContentLoaded event
//fetch the configuration info for the image location and sizes
//focus on the text field
//listen for click on the search button
//listen for keypress and enter or return

//after the click / enter press run a fetch
//results come back from fetch
//show the movie results page
//loop through the results and build divs 

//make something in the div clickable 
//get the id from the clickable element
//fetch the recommendations based on the movie id
