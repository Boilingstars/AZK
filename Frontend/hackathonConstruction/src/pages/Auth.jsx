import Input from '../components/UI/Input'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/action';
import { useState } from 'react'

export default function Auth() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer'); 

  const login = event => {
    event.preventDefault();
    dispatch(signIn(role))
    navigate('/main');
  }

  return (
    <div>
      <div className="upper-block">
        <h1 className='font-size-h1 bold'>Квадраты</h1>
        <p className='registration-description font-size-medium regular'>
          Удобный сервис по покупке и агрегации недвижимости группы застрощиков АЗК со встроенными ИИ инструментами
        </p>
      </div>
      <div className="default-block">
        <form
          className='registration-form-container'
          action=""
          onSubmit={login}
        >
          <div className="registration-form-container-buttons">
            <button
              type="button"
              className={`button-registration button-registration-${role === 'buyer' ? 'selected' : 'unselected'}`}
              onClick={() => setRole('buyer')}
            >
              <span className='medium font-size-medium'>Пользователь</span>
            </button>
            <button
              type="button"
              className={`button-registration button-registration-${role === 'dev' ? 'selected' : 'unselected'}`}
              onClick={() => setRole('dev')}
            >
              <span className='medium font-size-medium'>Застройщик</span>
            </button>
          </div>
          <div className="registration-form-container-inputs">
            <Input type="text" className='input-registration font-size-medium regular' placeholder='Имя'/>
            <Input type="tel" className='input-registration font-size-medium regular' placeholder='Телефон'/>
            <Input type="password" placeholder='Пароль' className='input-registration font-size-medium regular'/>
          </div>
          <button
            type="submit"
            className='button-registration'
            style={{backgroundColor: 'var(--color-accent)'}}
          >
            <span className='medium font-size-medium'>Войти</span>
          </button>
        </form>
      </div>
    </div>
  )
}

