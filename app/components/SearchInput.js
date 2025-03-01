import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import qs from "query-string";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const title = searchParams.get("title") || "";
  const [value, setValue] = useState(title);


  useEffect(() => {
    if (title.toLowerCase() !== value.toLowerCase()) {
      setValue(title);
    }
  }, [value,title]);


  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const newQuery = { title: value || undefined };

    const updatedUrl = qs.stringifyUrl(
      { url: `${currentUrl.origin}${pathname}`, query: newQuery },
      { skipEmptyString: true, skipNull: true }
    );

    if (updatedUrl.toLowerCase() !== window.location.href.toLowerCase()) {
      router.push(updatedUrl);
    }
  }, [value, pathname, router]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  if (pathname !== "/") return null;

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={value}
          onChange={onChange}
          className="block w-64 p-2 pl-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 rounded-xl focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
    </div>
  );
};

export default SearchInput;