import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'

type CarouselProps = {
  children: React.ReactNode
  options?: EmblaOptionsType
}

const Carousel: React.FC<CarouselProps> = ({ children, options = {} }) => {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    ...options
  })

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index),
    [embla]
  )

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, onSelect])

  return (
    <section className="h-full w-full relative">
      <div className="overflow-hidden h-full rounded-lg" ref={emblaRef}>
        <div className="flex w-full h-full">{children}</div>
      </div>
      <div className="absolute bottom-12 right-8 z-40 flex items-center gap-6">
        <button
          className="flex bg-white rounded-full h-12 w-12 items-center justify-center"
          onClick={scrollPrev}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 22 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.8651 37.0488C19.4736 37.6387 20.4405 37.6387 21.049 37.0489C21.3392 36.7666 21.5029 36.3789 21.5029 35.9739C21.5029 35.569 21.3392 35.1813 21.049 34.8988L4.61609 18.7187L21.044 3.09874C21.3331 2.81773 21.4962 2.43175 21.4962 2.02867C21.4962 1.6256 21.3331 1.23961 21.044 0.958603C20.4395 0.358749 19.4643 0.358871 18.86 0.958847L0.498047 18.7187L18.8651 37.0488Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          className="flex bg-white rounded-full h-12 w-12 items-center justify-center"
          onClick={scrollNext}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 22 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.13593 37.0488C2.5274 37.6387 1.56049 37.6387 0.951965 37.0489C0.661804 36.7666 0.498047 36.3789 0.498047 35.9739C0.498047 35.569 0.661743 35.1813 0.951965 34.8988L17.3849 18.7187L0.95697 3.09874C0.667908 2.81773 0.504761 2.43175 0.504761 2.02867C0.504761 1.6256 0.667908 1.23961 0.95697 0.958603C1.56146 0.358749 2.53668 0.358871 3.14099 0.958847L21.503 18.7187L3.13593 37.0488Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
      {/* <div className="flex items-center justify-center mt-5 space-x-2">
        {scrollSnaps.map((_, idx) => (
          <button
            className={`w-2 h-2 rounded-full ${
              idx === selectedIndex ? 'bg-yellow-500' : 'bg-gray-300'
            }`}
            key={idx}
            onClick={() => scrollTo(idx)}
          />
        ))}
      </div> */}
    </section>
  )
}

export default Carousel
