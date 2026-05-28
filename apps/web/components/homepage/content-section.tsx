'use client';

import Image from 'next/image';
import { SectionHeader } from '../SectionHeader';
import { FadeInWhenInView } from './hero-section';

export function ContentSection() {
  const cards = [
    {
      num: '1',
      title: 'Transform Operations, End-to-End',
      desc: 'From routine tasks to complex workflows, our AI agents streamline every interaction, improving efficiency, accuracy, and overall operational performance.',
      imgSrc: '/images/chat-elements-home.webp',
      bgColor: 'bg-white',
      bgImg: '/images/bg-shadow.svg',
      bgImgClass: 'opacity-100 scale-[1.15] md:scale-[1.15]',
      titleColor: 'text-[#1a202c]',
      descColor: 'text-[#4a5568]',
      numClasses: 'bg-[#4677E5] text-white',
      imgClass:
        '-mt-2 md:mt-0 w-[75%] md:w-[130%] mx-auto max-w-none h-auto object-contain relative right-3',
    },
    {
      num: '2',
      title: 'Customer Inquiries',
      desc: 'Provide instant, accurate responses to business\ninquiries — store hours, locations, promotions,\n policies, product availability, and pricing.',
      imgSrc: '/images/customer-inquiries.webp',
      bgColor: 'bg-white',
      bgImg: '/images/bg-shadow-2.svg',
      bgImgClass: 'opacity-100 scale-[1.15] md:scale-[1.15]',
      imgClass: '-mt-3 md:-mt-7 !w-[120%] md:!w-[150%] md:scale-113 mx-auto  h-auto object-cover',
    },
    {
      num: '3',
      title: 'Appointment Scheduling',
      desc: 'Book, cancel, or reschedule appointments for salons, with the option to choose your preferred professional.',
      imgSrc: '/images/calendar-widget.webp',
      bgColor: 'bg-white',
      bgImg: '/images/bg-shadow-3.svg',
      bgImgClass: 'opacity-100 scale-[1.15] md:scale-[1.15]',
      imgClass: '-mt-12 md:-mt-17 w-[60%] md:w-[90%] mx-auto h-auto object-contain',
    },
    {
      num: '4',
      title: 'Reservations & Phone Orders',
      desc: 'Capture real-time reservations and orders for restaurants, seamlessly integrated with your existing POS system to ensure accurate and efficient processing.',
      imgSrc: '/images/reservations-interface.webp',
      bgColor: 'bg-white',
      bgImg: '/images/bg-shadow-4.svg',
      bgImgClass: 'opacity-100 scale-[1.15] md:scale-[1.15]',
      imgClass:
        '-mt-9 md:-mt-16 mr-2 sm:mr-0 w-[95%] md:w-[110%] ml-auto max-w-none h-auto object-contain scale-108 sm:scale-100',
    },
  ];

  const finalCard = {
    num: '5',
    title: 'Customer Support',
    desc: 'Resolves issues and escalates complaints, ensuring seamless customer engagement with minimal human involvement.',
    imgLeft: '/images/card-5-mobile.svg',
    imgleftmobile: '/images/mobile.svg',
    imgRight: '/images/card-5-right.svg',
    bgImg: '/images/bg-shadow-5.svg',
    mobileLeftBg: '/images/last-card-bg.svg',
    bgImgClass: 'opacity-100 scale-[1.15] md:scale-[1.15]',
    bgColor: 'bg-white',
  };

  return (
    <section className="home-content-section py-10 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 section-bg-fade pointer-events-none">
        <div className="absolute w-full h-[200px] top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[240px] bg-gradient-to-r from-[#4E97FA] to-[#35B5F5] opacity-30 z-0" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          <SectionHeader
            tag={'Conversational AI'}
            title={'Power the Customer'}
            gradientTitle={'Experience of Tomorrow with AI Voice Agents'}
            splitGradientAfterFirstWordOnLaptop
            description={
              'Delivering natural, multilingual conversations 24/7, they adapt in real time to customer needs while boosting efficiency and reducing costs.'
            }
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-5 md:gap-8 items-stretch max-w-[1112px] mx-auto">
          {cards.map((card, index) => (
            <FadeInWhenInView key={index} delay={index * 100}>
              <div
                className={`relative overflow-hidden rounded-3xl shadow-lg w-full mx-auto border-0 outline-none flex flex-col pt-6 md:pt-8 px-5 md:px-8 ${card.bgColor} h-[345px] md:h-[430px]`}
              >
                {card.bgImg && (
                  <div
                    className={`absolute inset-0 z-0 pointer-events-none ${card.bgImgClass || 'opacity-80 mix-blend-multiply'}`}
                  >
                    <Image src={card.bgImg} alt="" fill className="object-cover object-center" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col  md:gap-2 mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${card.numClasses || 'bg-[#4677E5] text-white'}`}
                      >
                        {card.num}
                      </div>
                      <h3
                        className={`text-[16px] md:text-2xl font-bold leading-tight flex-1 ${card.titleColor || 'text-[#1a202c]'}`}
                      >
                        {card.title}
                      </h3>
                    </div>
                    <p
                      className={`text-[14px] md:text-base leading-relaxed ml-0 md:ml-11 w-full md:w-auto ${card.descColor || 'text-[#4a5568]'}`}
                    >
                      <span className="md:hidden">{card.desc.replace(/\n/g, ' ')}</span>
                      <span className="hidden md:inline">
                        {card.desc.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < card.desc.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`mt-4 md:mt-8 flex justify-center w-full relative ${card.num === '3' || card.num === '4' ? 'mt-2 md:mt-8' : ''}`}
                  >
                    <Image
                      src={card.imgSrc}
                      alt={card.title}
                      width={600}
                      height={600}
                      sizes="(max-width: 640px) 95vw, (max-width: 1024px) 600px, 720px"
                      className={`relative z-10 w-full md:w-auto md:max-w-none md:h-auto object-contain ${
                        card.num === '3' || card.num === '4'
                          ? 'max-w-[320px] h-[170px]'
                          : card.num === '2'
                            ? 'max-w-none h-auto'
                            : 'max-w-[300px] h-[140px]'
                      } ${card.imgClass}`}
                    />
                  </div>
                </div>
              </div>
            </FadeInWhenInView>
          ))}
        </div>

        <div className="mt-4 md:mt-8">
          <FadeInWhenInView delay={400}>
            <div
              className={`relative overflow-hidden rounded-3xl shadow-lg w-full max-w-[1112px] mx-auto border-0 outline-none flex flex-col lg:flex-row pt-6 md:pt-8 px-5 md:px-6 lg:px-10 lg:pt-0 ${finalCard.bgColor} h-[345px] lg:h-[278px]`}
            >
              {finalCard.bgImg && (
                <div
                  className={`absolute inset-0 z-0 pointer-events-none ${finalCard.bgImgClass || 'opacity-80 mix-blend-multiply'}`}
                >
                  <Image src={finalCard.bgImg} alt="" fill className="object-cover object-center" />
                </div>
              )}

              <div className="absolute inset-y-0 left-0 w-[58%] z-0 pointer-events-none md:hidden">
                <Image
                  src={finalCard.mobileLeftBg}
                  alt=""
                  width={320}
                  height={345}
                  className="h-full w-full object-cover object-left"
                  aria-hidden
                />
              </div>

              <div className="flex flex-col lg:flex-row justify-between w-full h-full relative z-10 pointer-events-none">
                <div className="flex flex-col w-full lg:w-1/2  h-full lg:pt-10 relative pointer-events-auto justify-between">
                  <div className="flex flex-col md:gap-2 max-w-lg w-full relative z-20 mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#4677E5] text-white font-bold text-sm">
                        {finalCard.num}
                      </div>
                      <h3 className="text-[16px] md:text-2xl font-bold text-[#1a202c] leading-tight flex-1">
                        {finalCard.title}
                      </h3>
                    </div>
                    <p className="text-[#4a5568] text-[14px] md:text-[15px] leading-relaxed ml-0 md:ml-11 w-full">
                      {finalCard.desc}
                    </p>
                  </div>
                </div>

                <div className="relative w-full h-[120px] lg:h-auto lg:flex-1 lg:min-h-0 lg:absolute lg:inset-y-0 lg:right-0 pointer-events-none mt-4 lg:mt-0 flex items-end lg:items-center justify-end">
                  <div className="absolute left-[20px] -bottom-3 sm:left-4 xl:left-[-10px]  lg:bottom-auto lg:top-[150px] lg:ml-30 ">
                    <Image
                      src={finalCard.imgLeft}
                      alt="Customer Support Mobile"
                      width={188}
                      height={100}
                      sizes="(max-width: 1024px) 150px, 188px"
                      className="w-[150px] h-[140px] lg:w-[187.56px] lg:h-[382px] object-contain object-top hidden md:block"
                    />
                    <Image
                      src={finalCard.imgleftmobile}
                      alt="Customer Support Mobile"
                      width={188}
                      height={100}
                      sizes="(max-width: 1024px) 150px, 188px"
                      className="w-[150px] h-[140px] lg:w-[187.56px] lg:h-[382px] object-contain object-top block md:hidden"
                    />
                  </div>

                  <div className="absolute bottom-18 right-[-10px] sm:right-4 xl:right-[-20px] lg:top-6 lg:right-0 lg:h-full lg:flex lg:items-center">
                    <Image
                      src={finalCard.imgRight}
                      alt="Customer Support Networking"
                      width={550}
                      height={120}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 500px, 550px"
                      className="relative w-[280px] h-auto bottom-5 left-0 lg:left-4 lg:w-[549.98px] lg:h-[277.98px] max-w-none object-contain lg:object-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenInView>
        </div>
      </div>
    </section>
  );
}
