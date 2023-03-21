import React, { useState, useEffect } from 'react';

function MealSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([]);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [displayedMeal, setDisplayedMeal] = useState(null);
  const [displayedImage, setDisplayedImage] = useState('');
  const [viewedMeals, setViewedMeals] = useState([]);
  const [viewedImages, setViewedImages] = useState([]);

  useEffect(() => {
    if (meals.length > 0) {
      const randomMealIndex = Math.floor(Math.random() * meals.length);
      const randomMeal = meals[randomMealIndex];
      const bannedAttributeNames = bannedAttributes.map(attr => attr.name);
      const shouldDisplay = !bannedAttributeNames.some(attrName => randomMeal[attrName]);
      if (shouldDisplay) {
        setDisplayedMeal(randomMeal);
        setDisplayedImage(randomMeal.strMealThumb); // set the displayedImage state to the meal image URL
        setViewedMeals([...viewedMeals, randomMeal]);
        setViewedImages([...viewedImages, randomMeal.strMealThumb]); // add the meal image URL to the viewedImages state
      } else {
        setMeals(meals.filter(meal => meal.idMeal !== randomMeal.idMeal));
      }
    } else {
      setDisplayedMeal(null);
    }
  }, [meals, bannedAttributes]);

  const handleSearch = async () => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMeals(data.meals);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanAttribute = (attribute) => {
    const isAttributeBanned = bannedAttributes.some(
      (attr) => attr.name === attribute.name && attr.value === attribute.value
    );
    if (!isAttributeBanned) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };

  const handleDisplayImage = (imageUrl) => {
    setDisplayedImage(imageUrl);
  };

  const handleDiscovery = async () => {
    let data;
    let counter = 0;
    do {
      const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
      try {
        const response = await fetch(url);
        data = await response.json();
        counter++;
      } catch (error) {
        console.log(error);
      }
    } while (data && bannedAttributes.some(attr => data.meals[0][attr.name] === attr.value) && counter < 10);
  
    if (data && data.meals) {
      setMeals(data.meals);
    }
  };
  
  

  return (
    <div>
      
      <button style={{color: "red"}} onClick={handleDiscovery}>Discovery</button>

      {displayedMeal && (
  <div key={displayedMeal.idMeal}>
    <div className="buttons-container">
      <button onClick={() => handleBanAttribute({ name: 'strMeal', value: displayedMeal.strMeal})}>
        {displayedMeal.strMeal}
      </button>
      <button onClick={() => handleBanAttribute({ name: 'strCategory', value: displayedMeal.strCategory })}>
        {displayedMeal.strCategory}
      </button>
      <button onClick={() => handleBanAttribute({ name: 'strArea', value: displayedMeal.strArea })}>
        {displayedMeal.strArea}
      </button>
      {displayedMeal.strTags && (
        <button onClick={() => handleBanAttribute({ name: 'strTags', value: displayedMeal.strTags })}>
          {displayedMeal.strTags}
        </button>
      )}
      {!displayedMeal.strTags && <button>NOTHING</button>}
      {!displayedMeal.strArea && <button>NOTHING</button>}
      {!displayedMeal.strCategory && <button>NOTHING</button>}
      {!displayedMeal.strMeal && <button>NOTHING</button>}
    </div>
    <div className="image-container">
      {displayedImage && <img src={displayedImage} alt={displayedMeal.strMeal} style={{ width: '400px', height: '250px' }} />}
    </div>
  </div>
)}

     

      {bannedAttributes.length > 0 && (
        <div>
          <h4>Banned Attributes:</h4>
          <ul>
            {bannedAttributes.map(attr => (
              <li key={attr.name}>{attr.name}: {attr.value}</li>
            ))}
          </ul>
        </div>
      )}


      <h1>Previously Viewed Meals:</h1>
      <ul>
        {viewedMeals.map(meal => (
          <li key={meal.idMeal}>{meal.strMeal}</li>
        ))}
      </ul>
    </div>
  );
  
}

export default MealSearch;
