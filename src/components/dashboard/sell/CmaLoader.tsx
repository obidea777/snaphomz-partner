const CmaLoader: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center p-10 ">
      <p className="font-medium text-base">
        Loading Comparative Market Analysis
      </p>
      <section className="w-full flex items-center justify-center bg-[#EDEDED] rounded-lg mt-10 ">
        <div className="bg-[#FF8700] p-1 rounded-lg w-6/12"></div>
        <div className="bg-[#EDEDED] p-1 rounded-r-lg w-6/12"></div>
      </section>
    </section>
  )
}

export default CmaLoader
