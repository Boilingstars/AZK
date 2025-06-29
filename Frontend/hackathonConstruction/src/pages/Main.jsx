import Input from "../components/UI/Input"
import { useDispatch, useSelector } from "react-redux"
import { fetchCards } from "../asyncActions/cards"
import { useEffect, useState, useMemo } from "react";

export default function Main() {

  const dispatch = useDispatch()
  const cards = useSelector(state => state.cards.cards)
  const [filterOpen, setFilterOpen] = useState(false);
  //console.log(cards)

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('')

  const poiskCards = useMemo(() => {
    let result = cards;

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(card => 
        {  
          return card.id,card.title.toLowerCase().includes(query)}
      );
    }
    return result;
  }, [cards, selectedFilter, search])

  const filteredCards = useMemo(() => {
    let result = cards;

    if (searchCity) {
      const query = search.toLowerCase();
      result = result.filter(card => 
        {  
          return card.id,card.title.toLowerCase().includes(query)}
      );
    }
    return result;
  }, [cards, selectedFilter, searchCity])

    const openFilter = () => setFilterOpen(true);
    const closeFilter = () => setFilterOpen(false);

  return (
    <div>
      <div className="upper-block">
        <div className="header-main">
         <h1 className='font-size-h1 bold'>Квадраты</h1>
          <button className='button-map-mode'><span className='font-size-regular medium'>Карта</span></button>
        </div>
        <div className="filter-main">
          <button onClick={openFilter} style={{height: '33px', width: '33px'}}className='filter-main-items'><img src="/icons_img/tune.svg" alt="" /></button>
          <Input style={{width: '87%'}}className='filter-main-items font-size-regular regular' placeholder='Поиск'
          value={search}
          onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className={search.length !== 0 ? "hide" : "default-block"}>
        <h2 className="font-size-block-header bold">Бесплатные услуги</h2>
        <div className="free-services">
          <div className="free-services-item">
            <img src="/icons_img/d.svg" alt="" style={{display:'inline-block'}}/>
            <p className="font-size-medium medium" style={{width:'74px'}}>Создадим интерьер</p>
          </div>
          <div className="free-services-item">
            <img src="/icons_img/h.svg" alt="" style={{display:'inline-block'}}/>
            <p className="font-size-medium medium" style={{width:'74px'}}>Подберем квартиру</p>
          </div>
        </div>
      </div>
      <div className={search.length !== 0 ? "hide" : "default-block"} style={{background: `linear-gradient(to right, #F0E6D1, var(--color-grad))`, cursor: 'pointer', paddingBottom: '0px', height: '100px'}}>
        <div style={{position: 'relative'}}>
          <h2 className="font-size-block-header bold">Бесплатная покупка</h2>
          <p className="font-size-medium regular">Подробно расскажем о всех<br /> этапах сделки</p>
          <img src="/public/icons_img/p.svg" alt="" style={{position:'absolute', bottom: '-16px', right: '-10px'}} />
        </div>
      </div>
      <div className={search.length !== 0 ? "hide" : "grid-of-default-blocks"}>
        <div className="grid-of-default-blocks-row">
          <div className="default-block" style={{width: '181px', height: '85px', position: 'relative', cursor: 'pointer'}}>
            <h2 style={{top: '10px', left: '20px', position: 'absolute'}}
            className="font-size-block-header bold">Расчитать ипотеку</h2>
            <img style={{bottom: '10px',left:'115px', position: 'absolute', display:'inline-block'}}src="/public/icons_img/ipoteka.svg" alt="" />
          </div>
          <div className="default-block"
          style={{width: '181px', height: '133px', position: 'relative', cursor: 'pointer'}}>
            <h2 style={{top: '10px', left: '20px', position: 'absolute'}}
            className="font-size-block-header bold">Проверенные застройщики</h2>
            <img style={{bottom: '10px',left:'125px', position: 'absolute', display:'inline-block'}}src="/public/icons_img/pers.svg" alt="" />
          </div>
        </div>
        <div className="grid-of-default-blocks-row">
          <div className="default-block"
          style={{width: '179px', height: '120px', position: 'relative', cursor: 'pointer'}}>
            <h2 style={{top: '10px', left: '20px', position: 'absolute'}}
            className="font-size-block-header bold">Доступные льготы</h2>
            <img style={{bottom: '10px',left:'118px', position: 'absolute', display:'inline-block'}}src="/public/icons_img/sale.svg" alt="" />
          </div>
          <div className="default-block"
          style={{width: '179px', height: '98px', position: 'relative', cursor: 'pointer'}}>
            <h2 style={{top: '10px', left: '20px', position: 'absolute'}}
            className="font-size-block-header bold">Как проходит сделка?</h2>
            <img style={{bottom: '5px',left:'125px', position: 'absolute', display:'inline-block'}}src="/public/icons_img/offer.svg" alt="" />
          </div>
        </div>
      </div>
      <div className="lower-block">
        <h2
        className="font-size-block-header bold">Ваши рекомендации</h2>
          {
            poiskCards.length !== 0?
            <div className="cards-list">
              {poiskCards.slice(0, 4).map((card) => 
                <div className="card" key = {card.id}>
                  <img src="/public/icons_img/image.png" alt="" className="card-img"/>
                  <div className="card-info">
                    <p className="card-info-price font-size-medium bold">{card.id}</p>
                    <p className="card-info-adres font-size-regular medium">{card.title[0]}</p>
                    <p className="card-info-kv font-size-small medium">{card.title[0]}</p>
                  </div>
                </div>
              )}
            </div>
            :
            <div>
              Рекомендаций нет или ошибка сервера!
            </div>
          }
          <button className="goToChat"></button>
        </div>
        <div className={`drawer-overlay${filterOpen ? " open" : ""}`} onClick={closeFilter}>
        <div
          className={`filter-drawer${filterOpen ? " open" : ""}`}
          onClick={e => e.stopPropagation()} // чтобы не закрывать при клике на сам фильтр
        >
          {/* Ваш контент фильтра */}
          <div className="filter-nav-container">
            <h2 className=" font-size-block-header medium" style={{margin:'20px 0px 20px 0px'}}>Фильтры поиска</h2>
          <button className=" font-size-medium medium"
          onClick={closeFilter}
          >Показать</button>
          <button className=" font-size-medium medium" onClick={closeFilter}
          style={{marginLeft:'10px'}}>Сбросить фильтр</button>
        </div>
        <p className=" font-size-medium medium f-p">Город поиска</p>
        <Input className='filter-main-items font-size-regular regular' placeholder='Введите город'
          value={search}
          onChange={e => setSearchCity(e.target.value)}></Input>
        <p className=" font-size-medium medium f-p">Комнатность</p>
        <div className="komnata font-size-regular regular">
          <button className="kvadr-button f-button"><span>1</span></button>
          <button className="kvadr-button f-button"><span>2</span></button>
          <button className="kvadr-button f-button"><span>3</span></button>
          <button className="kvadr-button f-button"><span>4</span></button>
          <button className="kvadr-button f-button"><span>5</span></button>
          <button className="kvadr-button f-button" style={{width:'61px',   padding: '10px'}}><span>Неважно</span></button>
        </div>
        <p className=" font-size-medium medium f-p">Цена</p>
        <div className="price-container">
          <Input style={{width: '80%'}}className='filter-main-items font-size-regular regular' placeholder='От'
          value={search}
          onChange={e => setSearch(e.target.value)}></Input>
          <Input style={{width: '80%'}}className='filter-main-items font-size-regular regular' placeholder='До'
          value={search}
          onChange={e => setSearch(e.target.value)}></Input>
        </div>
        <p className=" font-size-medium medium f-p">Отделка</p>
        <div className="komnata font-size-regular regular" style={{display: 'wrap'}}>
          <button className="otdelka-button f-button" style={{width: '76px'}}><span>Без отделки</span></button>
          <button className="otdelka-button f-button" style={{width: '170px'}}><span>Чистовая с мебелью</span></button>
          <button className="otdelka-button f-button" style={{width: '63px'}}><span>Чистовая</span></button>
          <button className="otdelka-button f-button"
          style={{width: '87px'}}><span>Предчистовая</span></button>
        </div>
        <p className=" font-size-medium medium f-p">Этаж</p>
        <div className="price-container">
          <Input style={{width: '80%'}}className='filter-main-items font-size-regular regular' placeholder='От'
          value={search}
          onChange={e => setSearch(e.target.value)}></Input>
          <Input style={{width: '80%'}}className='filter-main-items font-size-regular regular' placeholder='До'
          value={search}
          onChange={e => setSearch(e.target.value)}></Input>
        </div>
        <p className=" font-size-medium medium f-p">Тип дома</p>
        <div className="komnata font-size-regular regular" style={{display: 'wrap'}}>
          <button className="otdelka-button f-button" style={{width: '76px'}}><span>Неважно</span></button>
          <button className="otdelka-button f-button" style={{width: '170px'}}><span>Кирпичный</span></button>
          <button className="otdelka-button f-button" style={{width: '63px'}}><span>Блочный</span></button>
          <button className="otdelka-button f-button"
          style={{width: '87px'}}><span>Монолитный</span></button>
          <button className="otdelka-button f-button"
          style={{width: '87px'}}><span>Кирпично-монолитный</span></button>
        </div>
          </div>
      </div>
      </div>
  )
}
