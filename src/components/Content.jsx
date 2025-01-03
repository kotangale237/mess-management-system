import React from 'react'
import foodimg1 from '../assets/images/foodimg1.png'
import foodimg2 from '../assets/images/foodimg2.png'
import foodimg4 from '../assets/images/foodimg4.png'
import foodimg5 from '../assets/images/foodimg5.png'

import '../assets/styles.css'

const Content = () => {
  return (
    <div id='content'>
      <div id='swiper'>
        <div className='swiper-part'>
          <div className='swiper-part-imgdiv'>
            <img className='swiper-part-img' src={foodimg1} alt="" />
          </div>
          <div className='swiper-part-textdiv'>
            <h2 className='swiper-part-text'>
              Satisfy your cravings, everyday.
            </h2>
          </div>
        </div>

        <div className='swiper-part'>
          <div className='swiper-part-imgdiv'>
            <img className='swiper-part-img' src={foodimg2} alt="" />
          </div>
          <div className='swiper-part-textdiv'>
            <h2 className='swiper-part-text'>
              A world of flavours, right here.
            </h2>
          </div>
        </div>

        <div className='swiper-part'>
          <div className='swiper-part-imgdiv'>
            <img className='swiper-part-img' src={foodimg4} alt="" />
          </div>
          <div className='swiper-part-textdiv'>
            <h2 className='swiper-part-text'>
              Quality food, served with love.
            </h2>
          </div>
        </div>

        <div className='swiper-part'>
          <div className='swiper-part-imgdiv'>
            <img className='swiper-part-img' src={foodimg5} alt="" />
          </div>
          <div className='swiper-part-textdiv'>
            <h2 className='swiper-part-text'>
              The perfect blend of taste and affordability.
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content