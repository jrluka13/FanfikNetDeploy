import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../../components/loader/Loader";
import { BooksList } from "../../components/BooksList/BooksList";
import { FormattedMessage } from "react-intl";
import GroupInput from "../../components/groupInput/GroupInput";

export const Private = () => {
  const [books, setBooks] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const fetchBooks = useCallback(async () => {
    try {
      const fetched = await request("/api/book", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setBooks(fetched);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  if (loading) {
    return <Loader />;
  } else {
    return (
      <>
        <div>
          <h1 className="text-center">
            <FormattedMessage id="my-books.title" />
          </h1>

          <GroupInput />

          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column mt-5">
              <span>
                <h2>
                  <FormattedMessage id="my-books" />
                </h2>
              </span>

              {loading ? (
                <Loader />
              ) : (
                <div className="mt-2">
                  {!loading && (
                    <BooksList books={books} onChange={fetchBooks} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
};
