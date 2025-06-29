import { addCards } from "../store/action"

export const fetchCards = () => {
  return function(dispatch) {
    fetch('/apartments')  // обращаемся к прокси
      .then(response => response.json())
      .then(json => {
        console.log(json);
        dispatch(addCards(json));
      })
      .catch(error => {
        console.error('Ошибка при загрузке карт:', error);
      });
  }
}
