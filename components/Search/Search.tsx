import Image from 'next/image';

interface searchProps {
  onSearch: (city: string) => void;
}

const Search: React.FC<searchProps> = ({ onSearch }) => {
  return (
    <section className="flex justify-center py-2">
      <label
        htmlFor="search"
        className="flex rounded-full bg-neutral-300 p-3 outline outline-1 outline-gray-600 focus-within:outline-2 focus-within:outline-gray-800 dark:bg-neutral-600 dark:outline-gray-400 dark:focus-within:outline-gray-200"
      >
        <Image
          src="./images/search.svg"
          alt="Search Icon"
          width={36}
          height={36}
        />
        <input
          max={15}
          id="search"
          type="text"
          placeholder="Search by location..."
          className="bg-inherit outline-none placeholder:focus-within:text-gray-800 dark:placeholder:text-gray-200"
          autoComplete="off"
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>
    </section>
  );
};

export default Search;
