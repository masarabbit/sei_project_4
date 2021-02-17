# Project 4: Sixteensquared

## Index
* [Overview](./README.md#overview)
* [Brief](./README.md#brief)
* [Technologies Used](./README.md#technologies-used)
* [Approach](./README.md#approach)
	* [Mock Up](./README.md#mock-up)
	* [Requesting Data from the API](./README.md#requesting-data-from-the-api)
	* [Displaying Details of Individual Pokémon](./README.md#displaying-details-of-individual-pokémon)
	* [Styling and Animation](./README.md#styling-animation)
    * [Background](./README.md#background)
    * [Hover Effects](./README.md#hover-effects)
    * [Animation for Pokémon Entering the Page](./README.md#animation-for-pokémon-entering-the-page)
* [Final Thoughts](./README.md#final-thoughts)
	* [Wins and Challenges](./README.md#wins-and-challenges)
	* [Key Learnings](./README.md#key-learnings)


(Click [here](https://sixteensquared.herokuapp.com/) to see project)


(* I have used American spelling for 'favourite' and 'color' through out the code for the website. This is because the coding language itself uses American spelling, for example 'color' in CSS. In this Read Me I will be using the British spelling for these words, except when I am making direct references to codes and/or variables)


<br/>

## Overview 
This was my final project at General Assembly's Software Engineering Immersive Course - we were given 7 days to create a full stack website. As well as putting into practice what we had learnt during the lesson, I decided to use the opportunity to develop my personal experiment using canvas. 

I had already worked with HTML 5 canvas element to make a simple drawing app, but I was interested in finding out how it could be built in React. Also, for my earlier projects I did not experiment with users following each other, so I wanted to incorporate this feature into this project. With these thoughts in mind, I decided to make a website where users can draw and share pixel art.

We had the choice to work in group, or on our own - I decided to work on my own this time, since I have a tendency to lean a lot on the frontend when in group. I wanted to make sure I could put together the backend on my own.

<br/>

## Brief
* To build a full-stack application, making our own backend and frontend
* To use a Python Django API, using Django REST Framework to serve data from a Postgres database
* To build the frontend using React to consume the API
* The API should have multiple relationships and CRUD functionality for at least a couple of models


<br/>

## Technologies Used
* HTML5
* HTML5 canvas element
* CSS3 with animation
* JavaScript (ES6)
* Python
* React
* Django
* TablePlus
* Insomnia
* Git
* GitHub
* Google Chrome dev tools
* VScode
* Eslint
* Photoshop
* Illustrator


<br/>


## Approach
### ERD Diagram
As part of our sign off prcess, we had to submit an ERD diagram to illustrate what kind of database we planned to make. Below is what I submitted, made using [quickdatabasediagrams.com](https://www.quickdatabasediagrams.com/). The main models would be for the users, and a model for the pixel art the users could create on the site. A separate model was planned for the comments users could leave on drawings, and for the drawing category. 

  <p align="center">
	  <img src="README_images/database_diagram.png" alt="ERD diagram" />
  </p>

### Mock Up
From early stage, I had a fairly specific idea of what I wanted the project to look like - since my other projects were quite colourful, I wanted to make something sleek and simple, with limited colour palette. 

  <p align="center">
	  <img src="README_images/mockup_one.png" alt="mockup pages" />
  </p>

  <p align="center">
	  <img src="README_images/mockup_two.png" alt="mockup for the 'show page' of the pixel art" />
  </p>

I really like the 16 x 16 pixel art in old games, so I chose this as the grid size for the canvas drawing. This led me to make icons used in the website to be also made using 16 x 16 squares. 

   <p align="center">
	  <img src="README_images/assets.png" alt="assets" />
  </p>

The working title for the project was 'dotomo' - 'tomo' means 'friend' in Japanese, so the concept was that this would be a friendly community for 'dot artist'. I changed this for several reasons - the name needed some explanation, and also I realised that the term 'dot art' was more associated with pointilism (people in Japan tend to refer to 'pixel art' as 'dot art'). I also wanted to make the logo also fit into a 16 x 16 grid. 

  <p align="center">
	  <img src="README_images/logo.png" alt="sixteensquared logo" />
  </p>

This led me to settle with the name 'sixteensquared'. I originally thought of a black logo, but later added some blue and pink as I liked the glitchy offset effect it created. 

<br />

## Testing the Drawing Functionality
Before setting up the database in the backend, I spent some time testing if the HTML canvas element would work in the way I anticipated.

In vanilla JavaScript, I would have used the DOM to refer to a canvas element on the page, so that I could trigger functions to draw on it using 'EventListeners'. Having researched, I found that the common approach in React was to use the `useRef` hook to deal with canvas element. 

```
  const canvas = useRef()
  let ctx = null

  useEffect(() => {
    const canvasEle = canvas.current
    canvasEle.width = canvasEle.clientWidth
    canvasEle.height = canvasEle.clientHeight
    
    ctx = canvasEle.getContext('2d')
  }, [])
  ```

With the above set up, I could just add ` <canvas ref={canvas} />` in my JSX. The set up is triggered using  `useEffect` to make sure the component is mounted first before 'ctx' (context) is defined. 

Once 'ctx' is defined, I could use `ctx.fillRect(<x-coordinate>, <y-coordinate>, <fill width>, <fill height>)` to draw squares on canvas. For example, `ctx.fillRect(30, 40 , 10, 10)` would draw a 10 x 10 square on canvas, positioned 30px from the left and 40px from the top.

With this method, all I needed was a way to define the x and y coordinate. I figured that the best way to do this was to map a div into grid on the page, then give each divs an `onclick` event. By giving each divs an id based on it's grid position, it could be used to calculate the x and y coordinate.

So I first mapped out the grid using function below:

```
  const mapGrid = ()=>{    
    const grids = []
    for (let i = 0; i < 256; i++){
      grids.push(i)
    }
    return grids.map(grid=>{
      return (
        <div key={grid} 
          id={grid}
          className="grid">
          {grid}
        </div>
      )
    })
  }
```

This gave me a grid like below (for clarity, I mapped the grid number within each grid as well). 

  <p align="center">
	  <img src="README_images/grid.png" alt="16 x 16 grid mapped out" />
  </p>

To each of divs in the grid, I assigned an `onclick` event below - this would essentially draw a black square in the coordinate clicked on the grid. 

The x coordinate can be worked out using modulus - for example, if I clicked 58, `58 % 16` would be 10, which I could multiply by 20px to give me 200px.

The y coordinate can be calculated by dividing the number by 16, and multipliying the answer (rounded down) by 20 - eg, `58 / 16 = 3.625`, and `3 * 20px = 60px`. In other words, 58 would be 60px down.

```
  const drawSquare = e =>{
    const x = e.target.id % 16 * 20
    const y = Math.floor(e.target.id / 16) * 20
   
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, 20, 20)
  }

```  

Screen capture below shows the function in action.

  <p align="center">
	  <img src="README_images/58_coloured.gif" alt="canvas coloured by clicking on the square" />
  </p>

By layering the grid on top of the canvas, the position being clicked and square being filled becomes synced.

 <p align="center">
	  <img src="README_images/other_squares_coloured.gif" alt="grid layered on top of the canvas" />
  </p>

I then took this a step further by adding a colour input field which can set the selected colour to state. However, this was where I started encountering issues. This can be seen in the screen capture below. Each time I set a new colour, the canvas rerenders and squares shaded in the previous colour disappears.

 <p align="center">
	  <img src="README_images/testing_colour.gif" alt="shaded squares resetting each time a different colour is set" />
  </p>


As a work around, I added a line in the 'drawSquare' function to set whatever drawn on the canvas to a state variable called 'drawingRecord'. 
```
  const drawSquare = e =>{
    const x = e.target.id % 16 * 20
    const y = Math.floor(e.target.id / 16) * 20

    ctx.fillStyle = drawSetting.color
    ctx.fillRect(x, y, 20, 20)
    setDrawingRecord(canvas.current.toDataURL())
  }

```

I then added a useEffect which would redraw the drawn image onto the canvas each time the fill colour and/or drawingRecord was updated. The canvas image was stored in 'drawingRecord' as Base64 data, which could be redrawn using the drawImage() method. This ensured that the shaded squares persisted even when the fill colours were changed.

 useEffect(() => {
    if (drawingRecord) {
      const image = new Image()
      image.onload = function() {
        ctx.drawImage(image, 0, 0)
      }
      image.src = drawingRecord
    }
  }, [drawSetting, drawingRecord])

<br/>

### Storing the Drawing on the Database

Once I had the basic drawing functionality working, I had to figure out how to store it on the database. The first idea I had was to send the image to Cloudinary, retrieve the image url from Cloudinary, then send this to the database. I was keen to try this out because I had read in the documentation that you could send images as Base64 data to Cloudinary. 

Below is the function, and it worked! The image drawn on the canvas was indeed sent to Cloudinary, so became accessible via it's generated url.

  ```
  const handleUpload = async () => { 
    const can = canvas.current.toDataURL('image/png')
    const data = new FormData() 
    data.append('file', can)
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    setDrawingUrl(res.data.url)
  }
  ```

  <p align="center">
	  <img src="README_images/test.png" alt="test image drawn on the canvas" />
  </p>

  Once I had the image url, it could be easily displayed again on the website.

  <p align="center">
	  <img src="README_images/test_displayed.png" alt="test image displayed" />
  </p>

However, I settled on recording the image both as canvas-generated png and as a stringified array of hex colour codes, since I felt it gave me more freedom for manipulation later down the line. Also, I found that redrawing the image onto the canvas from the Cloudinary url caused the canvas to 'taint'. Screenshot below shows the error message I saw when I tried to render the canvas with the Cloudinary url. Apparently this is a 'securityError' , since the image could have come from anywhere.

 <p align="center">
	  <img src="README_images/canvas_taint.png" alt="error message for 'tainted' canvas " />
  </p>

### Recording Hex Colour Codes

To record the hex colour codes, I first made an array of 256 blank strings:

```
  const [dots, setDots] = React.useState(Array(256).fill(''))
```

Then, it was a case of adding lines below into the drawing function, pushing the hex code into the relevant index of the dots array, setting it to state.

```
dots[e.target.id] = drawSetting.color
setDots(dots)
```

This would give me an array like below. I was able to send this to the database as strings by using `JSON.stringify()`. To reuse data, it can changed back to array with `JSON.parse()`.

 <p align="center">
	  <img src="README_images/dots.png" alt="error message for 'tainted' canvas " />
  </p>

Once I had this array, I realised that I could draw without using canvas by replacing ` ctx.fillRect(x, y, 20, 20)` with `e.target.style.backgroundColor = drawSetting.color`. This was lot simpler because I didn't even have to specify the coordinate. Also, if the grid was rerendered due to any change on the page, the divs could be coloured again by referring to the hex codes stored in the 'dots' array:

```
const drawIntoGrid = (sourceDots, target) =>{
  sourceDots.forEach((dot, i)=>{
    target.current.children[i].style.backgroundColor = dot
  })
}
```

I also had the idea to store the colour palette of the image on the database. The colour palette would be derived from the 'dots' array by sorting the hex codes in order of prevalence, then removing duplicates. 

```
const sortedByFrequencyDuplicatesAndBlankRemoved = array =>{  
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  const blankRemoved = array.filter(dot=> dot !== '' && dot)
  const orderedByFrequency = blankRemoved.map(ele=>{  
    return `${ele}_${countOccurrences(blankRemoved,ele)}`
  }).sort((a, b) => b.split('_')[1] - a.split('_')[1])  
  return [ ...new Set(orderedByFrequency.map(ele=>ele.split('_')[0]))]
}
```

For simplicity, I also limited the palette to 8 colours with function below:

```
  const filterPalette = arr =>{
    const palette = Array(8).fill('')
    for (let i = 0; i < 8; i++){
      palette[i] = sortedByFrequencyDuplicatesAndBlankRemoved(arr)[i]
    }
    return palette
  }
```  

Having the data for the colour palette allowed me to map them onto various part of the website, like below:
 <p align="center">
	  <img src="README_images/palette.png" alt="colour palette" />
  </p>

Arguably, I no longer needed the canvas, since I could draw with the divs and redraw the images with the hex colour code. However, I left the canvas in since having the url for png image useful for rendering thumbnail images.

<br/>

## Setting up the Backend

Once I tested the basic drawing functionality and identified what kind of data I wanted on the database, I worked on setting up the backend.
### User Model

After setting up the boiler-plate Django, the first thing I set up was the user model. I used the default user model that comes with Django, but made slight customisation. I eventually added a many-to-many relationship to itself to add the 'followed_by' and 'following' field, but other than this left the user model basic since the Django user model came complete with enough features, including password verification.

```
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True)
    profile_image = models.CharField(max_length=300)

```    

### Pics and Categories Model

The drawings to be stored on the database had the following model:

```
from django.db import models

class Pic(models.Model):
    title = models.CharField(max_length=50)
    image = models.CharField(max_length=300)
    description = models.TextField(max_length=200, null=True, blank=True)
    dots = models.TextField(max_length=3100)
    color_palette = models.TextField(max_length=100)
```    

I eventually added relationships below to the model. I made another model for categories, which simply had a field for the category name (the id would be defined automatically by Django). To keep the project simple, I didn't add a functionality to enable user to add their own category this time. Users could 'like' the pixel art, and this would be stored in the database as 'favourited_by'.

```
    categories = models.ManyToManyField(
        "categories.Category",  
        related_name="pics"
    )  
    artist = models.ForeignKey(
        "jwt_auth.User",
        related_name="created_pic",
        on_delete=models.CASCADE
    )
    favorited_by = models.ManyToManyField(
        "jwt_auth.User",
        related_name="favorited_pic",
        blank=True
    )
```

The functionality for favouriting the pixel art was defined in the views.py. I was going to change the icon displayed on the frontend depending on if the pixel art was favourited or not, so I settled with having two separate definitions rather than having just one to toggle the status.

```
class PicFavoriteView(PicDetailView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        pic_to_favorite = self.get_pic(pk=pk)
        pic_to_favorite.favorited_by.add(request.user.id) 
        pic_to_favorite.save()
        serialized_favorited_pic = PopulatedPicSerializer(pic_to_favorite)
        return Response(serialized_favorited_pic.data, status=status.HTTP_201_CREATED)


    def delete(self, request, pk):
        pic_to_unfavorite = self.get_pic(pk=pk)
        pic_to_unfavorite.favorited_by.remove(request.user.id) 
        pic_to_unfavorite.save()
        serialized_favorited_pic = PopulatedPicSerializer(pic_to_unfavorite)
        return Response(serialized_favorited_pic.data, status=status.HTTP_204_NO_CONTENT)        
```


### Comments Model

Comments were given its own model, then hooked up with the users and pics models with one-to-many relationship.

```
class Comment(models.Model):
    text = models.TextField(max_length=200)
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    pic = models.ForeignKey(
        "pics.Pic",
        related_name="comments",
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="posted_comments",
        on_delete=models.CASCADE
    )
```    
I spent one whole day setting up the backend, testing as I went using Django's inbuilt admin page and insomnia. Once the backend was functional, I set up React to work on the frontend - once I moved onto this stage I made minor tweaks in the backend, mainly to alter what data was visible from where by changing the settings on the serializers. 

I added some users using a seed data loaded with `python manage.py loaddata jwt_auth/seeds.json` command, but this time I couldn't create the seed data for the pixel art in advance, since it needed the hex colour code arrays. These were easier to produce using the drawing function in the website. 
<!-- Due to the nature of Django, it was easier to set up compared to Mongo and Express, however I did find that there were less freedom with Django's seeding process. -->

 <p align="center">
	  <img src="README_images/insomnia.png" alt="insomnia" />
  </p>

<br />

## Building the Frontend

With the backend put into place, I worked on the frontend. Since the drawing functionality was already tested in advance, I was able to hook this up to the backend with relative ease. Drawing would be sent to the database as a stringified array of hex colour code as part of the formdata, along with the image url generated with Cloudinary, using axios post request below:

```
function createPic(formdata){
  return axios.post(`${baseUrl}/pics/`,formdata)
}
```
I had plans to add further drawing related features, but decided to focus first on the social aspect of the website - the functionality to allow users to favourite art work, add comments, and follow other users. To work on these functionality, I needed to be able to login to the page.

<br />

### User Registration and Login

I tend to favour rounded border radius and squishy animation effects using `transform: scale`, but decided to keep the design sharp and square this time, since the site was about pixel art. I kept the form design simple, with each input field represented by an icon (since the icon on its own may not be obvious, I labelled each field using placeholders). I had a concept of a square sliding in and transforming into the form. I realised this with the following keyframe animation:

```
@keyframes form_load {
  0% {
    border: 2px solid black;
    background-color: black;
    left: -200vh;
    height: 0;
    width: 0;
    padding: 10px;
  }
  40% {
    left: 30vh; 
    width: 0;
  }
  60% {
    left: 0vh; 
    width: 300px;
  }
  61% {
    border: black;
    background-color: black;
  }
  80% {
    border: #b2eaf9;
    background-color: white;
    height: 0;
    padding: 10px 20px;
  }
  100% {
    border: 2px solid #b2eaf9;
    background-color: white;
    left: 0vh; 
    padding: 30px 20px 20px 20px;
    height: 200px;
    width: 300px;
  }
}
```

Having played around with keyframe animations, I realised you could use pretty much any css property. I think this was the first time I changed the padding using the animation. Pretty much every property for this css class were defined in the final keyframe. It meant I had to edit the animation each time I wanted to restyle this class, however I felt it was worth the hassle. The result can be seen in the screen capture below. I'm pleased that I managed to recreate what I had in mind. 

 <p align="center">
	  <img src="README_images/login_form.gif" alt="login form animation" />
  </p>

Since the form came in from the left when it was loaded, I felt it would be natural to make it slide out of the page again when the user successfully logged in. I decided to jazz up this animation by animating other random squares slide together with the form. Screen capture below shows what I mean:

   <p align="center">
	  <img src="README_images/sign_in.gif" alt="animation for successful login" />
  </p>

This was done by mapping out square divs onto the page with random positions. They would start off invisible with the `opacity` set to 0.

```
.wrapper {
  .color_block_container {
    height: 20px;
    width: 20px;
  }
  
  .color_block {
    height: 100%;
    width: 100%;
    animation: none;
    opacity: 0;
    transition: 0.5s;
  }
}
``` 

On successful login, class 'animate' is added to the wrapper - this triggers all divs with the class 'class_block' to be animated with the 'slide' keyframe. Controlling the animation by toggling classes on the parent div saved me from attaching new classes to each child divs, which would have required some sort of loop. With this animation I also altered the width of the div, which creates the illusion of the divs blurring due to high speed.

```
.wrapper.animate {
  .color_block {
    position: relative;
    animation: slide forwards ease 1s;
  }
}

@keyframes slide{
  0% {width: 100px; margin-left:-100vh; opacity: 0}
  40% {margin-left:-20px; width: 100%; opacity: 1}
  70% {width: 100%; margin-left:0}
  100% {width: 2000px; margin-left: 100vh;}
}
```

The buttons were given hover effects inspired by glitchy offset effect which I had applied to the website logo. This was achieved by applying separate keyframe animation to pseudo elements. The pseudo elements were coloured in blue and pink, but were only visible during the hover animation because they were styled with `  mix-blend-mode: color-burn;`.

   <p align="center">
	  <img src="README_images/login_button.gif" alt="login button animation" />
  </p>

```
button:hover {
  animation: offset_zero 0.5s infinite;
}

button:hover::before {
  animation: offset_one 0.5s infinite;
}

button:hover::after{
  animation: offset_two 0.5s infinite;
}

@keyframes offset_zero {
  0%{transform: translate(0);}
  50%{transform: translate(0, -2px);}
  100%{transform: translate(0);}
}

@keyframes offset_one {
  0%{transform: translate(0);}
  50%{transform: translate(-5px, -5px);}
  100%{transform: translate(0);}
}

@keyframes offset_two {
  0%{transform: translate(0);}
  50%{transform: translate(5px, 5px);}
  100%{transform: translate(0);}
}

```

Similar styling and animation were applied to the registration form. Since the form was bigger than the login form, the keyframe animation was tweaked to accomodate this.

   <p align="center">
	  <img src="README_images/registration_form.png" alt="registration form" />
  </p>

<br />

### Favouriting

With the login functionality set up, it was easier to testing the various social interaction features. The favouriting functionality would work by recording the logged in user's id in the 'pics model' database under the 'favorited_by' field. I figured it would intuitive if favouriting and unfavouriting could be done with the same button, with the button being coloured differently to indicate if it has been favourited already or not. I displayed the number of favourites next to the button to make this even more obvious.

   <p align="center">
	  <img src="README_images/like_unlike.gif" alt="favouriting and unfavouriting" />
  </p>

 As mentioned earlier, I had made separate definitions in the backend to trigger favouriting and unfavouriting - I controlled this by assigning these definitions to different buttons. Although the user only sees one button, a different button is actually displayed using a ternary operator below:

```
 !like ?
  <div 
    className="menu_button"
    onClick={handleFavorite}
  >
    <img src={star} alt="star" />
  </div>  
  :
  <div 
    className="menu_button clicked"
    onClick={handleUnFavorite}
  >
    <img src={star} alt="star" />
  </div>  

```

While building, I intially encountered a problem where result of the button was not reflected until the page was refreshed (ie, the button did trigger the favouriting, but the result was reflected on the page until a refresh). This threw me for a while, but I was able to resolve by having the favouriting function update a 'likedNow' state, which I included in the dependency array for the useEffect below. 

```
  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getSinglePic(id)
        setPic(data)

      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[id, likedNow])
```  

By doing this, the website would re-request data from the backend each time the favourite button was clicked, triggering a rerender. 

Similar approach worked for the follow/unfollow button. 

   <p align="center">
	  <img src="README_images/follow_unfollow.gif" alt="following and unfollowing" />
  </p>

I also did something similar for the commment button, but instead of toggling it with uncomment button, I switched it with a grey-out button to indicate that no more comments could be added (users could only add one comment to each pixel art). 

   <p align="center">
	  <img src="README_images/commented.png" alt="comment button greyed out" />
  </p>

This was done by having the website check if any of the existing comments were made by the user viewing the page. 
```
  const commentedByUser = arr => {
    return arr.comments.filter(comment=>{
      return comment.owner.id === userId
    }).length > 0
  }

```
Once this was determined, it could be used to dictate which buttons would be displayed (the comment button would also be greyed out if the user was not logged in).

```
 {!userId || commentedByUser(pic) ?
    <div className="menu_button inactive">
      <img src={comment} alt="speech bubble" />
    </div> 
    :
    <div className="menu_button"
      onClick = {displayCommentForm}
    >
      <img src={comment} alt="speech bubble" />
    </div> 
  }                
```
The comment can be deleted by clicking the delete button, which would only be displayed if the user's id matched the comment owner's id (ie, users can only delete comments they made themselves):

   <p align="center">
	  <img src="README_images/comments.png" alt="comment delete button" />
  </p>

<br/>

### Making Use of Database Relationships

I had set up the backend so that the website could request data of all the drawing made by a particular user. Using this, I made a user profile page, which was essentially a gallery of that user's work. To this, I added section which also displayed art favourited by the user, and arwork created by other users followed by the user.

  <p align="center">
	  <img src="README_images/feed.png" alt="user feed" />
  </p>


Clicking the artwork would take you to the page showing the artwork on its own, displayed along with any comments added. Each user icon displayed on these page can be clicked through to show that user's feed, which would display their work, any art they have favourited and so on. Clicking on the category underneath the artwork would display a other artwork with the same category, so this is another way to find more work.

  <p align="center">
	  <img src="README_images/image_display.png" alt="single image displayed" />
  </p>

I also made a separate page to display a user's follower by clicking on 'followers' link on the top of the profile page. This displays list of users with selection of artwork by each of the users - these are also links, so users can explore the website and find even more users and artwork through this page.

   <p align="center">
	  <img src="README_images/followers.png" alt="followers" />
  </p>

Similar page was also made to dislay users followed by any given user - in other words, the website offers users the opportunity navigate around the website from various angle, made possible due to how the database is linked with various relationships.

   <p align="center">
	  <img src="README_images/following.png" alt="following" />
  </p>

<br/>

## Other Drawing Features (Forking) / continous line

Having created the functionalities to enable users to share and interact with each other, I added further functionality in relation to creating pixel art.

There were two features I was keen to build - feature enabling users to upload files from their desktop, and feature to enable user to 'fork' someone else's artwork.

<br />

### Upload function

While creating sample pixel art to populate the website, I felt it would be useful to add a feature to upload images, rather than limiting the user to create the artwork on the website. Even better, if a non-pixel art image could be uploaded and converted to pixel image, it could help users get started quicker. I researched ways to approach this, and came up with the following solution.

First, I made a function below, tied to an file input field. It converts uploaded file to a 'blob URL' and sets it to state.

```
  const mapFromImage = e => {
    if (!e.target.files[0]) return
    const uploadedImage = e.target.files[0]
    const blobUrl = window.URL.createObjectURL(uploadedImage)
    setUploadedImageBlobUrl(blobUrl)
  }

```
Then, the blob URL set to set to state triggers an `useEffect` below. The blob URL is then assigned to an image created with the `Image()` constructor, then written onto the canvas using `drawImage()`. Once this is done, the drawing can be read using `getImageData()` - with this function, you can convert images into pixel data by specifying the coordinate and area of the image to be sampled. I created a loop to sample pixel data the uploaded image, referencing 256 coordinates. The array of 256 colour codes were then used to colour the grid, thus converting the uploaded image into a pixel art. 

```
  React.useEffect(() => {
    if (!uploadedImageBlobUrl) return

    setUpCanvas()

    if (uploadedImageBlobUrl) {
      const image = new Image()
      image.onload = function() {    

        ctx.drawImage(image, 0, 0, 320, 320)
        const dotsFromImage = []

        for (let i = 0; i < 256; i++) {
          const y = Math.floor(i / 16) * 20
          const x = i % 16 * 20
          const c = ctx.getImageData(x + 5, y + 5, 1, 1).data
          const hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
          dotsFromImage.push(hex)
        }
        setDots(dotsFromImage)
        drawIntoGrid(dotsFromImage,drawingGrid)
      }
      image.src = uploadedImageBlobUrl
    }
  }, [uploadedImageBlobUrl])
```

The catch was that the `getImageData()` returns UintClampedArray, which is similar to the rgba colour code. What I needed instead was hex colour code. Fortunately, this was a common problem, so there were abundance of solutions online. I found an elegant snippet below on [this Stack Overflow thread](https://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mousemove) which worked perfectly.

```
  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }
```  
The function accepts each of the `rgb` value as the argument, so it is was combined with the `getImageData()` in the following manner:

```
  const c = ctx.getImageData(x + 5, y + 5, 1, 1).data
  const hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
```

Finally, since `ctx.drawImage(image, 0, 0, 320, 320)` would distort the image if the user uploaded something that was not square, I replaced it with the following lines. This would keep the natural ratio of the image, and crop any excess instead. I used a conditional flow to determine where to crop, depending on if the image is landscape or portrait.

```
    const width = image.naturalWidth 
    const height = image.naturalHeight 
    if (width < height){
      canvas.current.setAttribute('width', 320)
      canvas.current.setAttribute('height', 320 * (height / width)) 
      ctx.drawImage(image, 0, 0, 320, 320 * (height / width))
    } else {
      canvas.current.setAttribute('width', 320 * (width / height))
      canvas.current.setAttribute('height', 320) 
      ctx.drawImage(image, 0, 0, 320 * (width / height), 320)
    }
```      
Screen capture below shows this functionality in action:


   <p align="center">
	  <img src="README_images/upload.gif" alt="image uploaded and converted to pixel art" />
  </p>

Once rendered, the uploaded image can be edited by the user by clicking on each squares.



<br />

### Forking the Image

What if you could load any image they had favourited, and make their own copy which could be edited freely? This idea was inspired by the forking functionality in GitHub. The solution was surprisingly simpler compared to the image upload feature explained earlier.

Since I already had the function for mapping images using array of hex codes ('drawIntoGrid()'), I just needed a way to retrieve the array from the database so that I could pass it on this function.

```
  const fork = forkedDots =>{
    drawIntoGrid(JSON.parse(forkedDots),drawingGrid)
    setDots(JSON.parse(forkedDots))
  }
```

I achieved this by mapping out the array containing user's favourited image. Within the mapping function,  I assigned the 'fork' function mentioned above to the `img` element, which allowed me to pass the array of hex code relating to the image directly to the function. I made a similar function for the colour palette as well, allowing users to load palettes relating to images they had favourited.

```
  const mapOptions = arr =>{
    return arr.map(pic=>{
      return (
        <div key={`p${pic.id}`}
          className="palette_wrapper"
        >
          <img onClick ={()=>fork(pic.dots)}
            src={pic.image} alt={pic.title}
          />  
          <div onClick={()=>{
            setDisplayPalette(false)
            setPalette(JSON.parse(pic.colorPalette))
          }}
          className="palette_option"
          >
            {mapFavoritedPalette(pic)}
          </div>  
        </div>
      )
    }
    )
  }
```

Screencapture below shows this feature in action:

  <p align="center">
	  <img src="README_images/forking.gif" alt="favourited pixel art and colour palette 'forked' " />
  </p>

<br />

### Other Drawing Features 

While using the drawing interface, I felt it would be easier to draw if I could click and drag to create a line rather than clicking repeatedly. I enabled this by introducing a state variable called 'draw' which is turned either `true` or `false`, toggled by `onMouseDown` and `onMouseUp`:

```
  const drawOn = ()=> setDraw(true) 
  const drawOff = ()=> setDraw(false)
```

```
<div className="grid_wrapper"
  onMouseDown={drawOn}
  onMouseUp={drawOff}
  ref={drawingGrid}
> 
 //* ... mapped grid and canvas ... */
</div>
```

The 'draw' state would determine if the mouse stroke would trigger the squares to be coloured or not. In other words, user can draw by moving the mouse while clicked down, and stop drawing by releasing the mouse.

```
  const drawDot = e =>{
    if (!draw) return
    e.target.style.backgroundColor = drawSetting.color
    dots[e.target.id] = drawSetting.color 
    setDots(dots)
  }
```

Even with the above added, I left in the drawing function triggered by clicking each squares, since users may want to draw bit by bit aswell. Also, I enabled the user to remove fill colour by clicking on the square that is already filled. This is simply done by having the function check if the square has a `backgroundColor` already or not.

```
const drawDotClick = e =>{
  const color = e.target.style.backgroundColor === '' ? drawSetting.color : ''
  e.target.style.backgroundColor = color
  dots[e.target.id] = color
  setDots(dots)
}
```  

Screen capture below shows these two functionalities in action:

  <p align="center">
	  <img src="README_images/drawing.gif" alt="continous line drawn and deleting by clicking" />
  </p>

<br />

### Undo

I also attempted a function allowing users to undo what they have done. It works by recording the array of hex codes each time the user draws - this essentially creates an array of an array, which is set to state. Clicking the back button would fire a function which references the last recorded array of hex codes, and renders it on the grid. 

  <p align="center">
	  <img src="README_images/undo.gif" alt="undo button in action" />
  </p>

It works fine for undoing few steps, but I found it buggy when I used it repeatedly on large number of steps - this seems to be because the recorded array keeps track of everything, including any mistakes that were undone. In other words, the undo button would sometimes undo a step where the user undid something (very confusing...) Due to time constraint I did not refine this any further, but would be nice to revisit this feature at some point.

<br />

### Colour Palettes

The final feature I would like to touch on is the colour palettes - the colour used on the grid is recorded each time the user draws. User can reuse a colour they have already used by clicking these palettes. Users can also select colours from the palette 'forked' from a drawing they have favourited.

  <p align="center">
	  <img src="README_images/palette.png" alt="palettes featuring colours already used by the user, and palette 'forked' from other users' artwork" />
  </p>

<br />

## Final Thoughts
### Wins and Challenges
I had a lot of fun working on this project, as I was able to play with HTML canvas element 

We chose to use Bulma for some of the CSS. I found myself fighting against Bulma at times, but it was useful for getting things into shape quickly, such as the stats bar and form fields. Having said this, if I were to make something similar in the future, I would probably write my own CSS to have better control.

<br />

### Key Learnings