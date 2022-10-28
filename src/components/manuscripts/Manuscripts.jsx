import axios from "axios";
import Card from "./card/Card";
import style from "./manuscripts.module.css";
import React from "react";

// "Элемент Manuscripts принимает праметры-пропсы с более высокого элемента - App. ";
// Тэгам мы придаем имена вот таким образом - className={style.manuscripts_section} - потому что импортируем их из отдельного css-файла (см. в верху страницы)

const Manuscripts = (props) => {
  const onAddToSelected =  (addedManuscript) => {
    try {
      if (
        props.overlayManuscripts.find(
          (item) => Number(item.id) === Number(addedManuscript.id)
        )
      ) {
        axios.delete(`https://63500d14df22c2af7b61c10a.mockapi.io/cart/${addedManuscript.id}`)
        props.setOverlayManuscripts((prev) =>
          prev.filter((item) => Number(item.id) !== Number(addedManuscript.id))
        );
      } else {
        // Отправляем в серверную часть карточки, которые кнопкой выбрали в Selected:
       axios.post(
          "https://63500d14df22c2af7b61c10a.mockapi.io/cart",
          addedManuscript
        );
        props.setOverlayManuscripts([
          ...props.overlayManuscripts,
          addedManuscript,
        ]); //Добавляем в стейт новый объект
      }
    } catch {
      alert("Failed to add the manuscript to Selected");
    }
  };

  const onAddToFavourities = (addedFavouriteManuscript) => {
    try {
      if (
        props.favouriteManuscripts.find(
          (obj) => Number(obj.id) === Number(addedFavouriteManuscript.id)
        )
      ) {
        axios.delete(
          `https://63500d14df22c2af7b61c10a.mockapi.io/favourities/${addedFavouriteManuscript.id}`
        );
      } else {
        axios.post(
          "https://63500d14df22c2af7b61c10a.mockapi.io/favourities",
          addedFavouriteManuscript
        );
        props.setFavouriteManuscripts([...props.favouriteManuscripts, addedFavouriteManuscript]);
      }
    } catch {
      alert("Failed to add the manuscript to your favourites list");
    }
  };

  const onSearchInput = (inputValue) => {
    props.setSearch(inputValue.target.value);
  };

  return (
    <div className={style.manuscripts_section}>
      <div className={style.search}>
        <h2>
          {props.search ? "Search by: " + props.search : "All manuscripts"}
        </h2>
        <div className={style.search_block}>
          <img src="./img/search.png" alt="search" />
          <input
            onChange={onSearchInput}
            placeholder="Search by manuscripts"
          ></input>
        </div>
      </div>

      <div className={style.manuscripts}>
        {props.manuscripts
          .filter((manuscript) =>
            manuscript.title.toLowerCase().includes(props.search.toLowerCase())
          )
          .map((manuscript) => {
            return (
              <Card
                key={manuscript.id}
                id={manuscript.id}
                title={manuscript.title}
                description={manuscript.description}
                shelfNumber={manuscript.shelfNumber}
                img={manuscript.img}
                onFavourite={(favouriteManuscript) => {
                  onAddToFavourities(favouriteManuscript);
                }}
                onPlus={(selectedManuscript) => {
                  onAddToSelected(selectedManuscript);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Manuscripts;
