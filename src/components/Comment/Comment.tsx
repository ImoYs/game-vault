import { useState, useEffect } from 'react';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/comments')
      .then((res) => res.ok ? res.json() : Promise.reject('โหลดคอมเมนต์ไม่สำเร็จ'))
      .then(setComments)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div>
      <h1>ความคิดเห็น</h1>
      {comments.length ? (
        <ul>
          {comments.map(({ id, user, content, game }) => (
            <li key={id}>
              <p><strong>{user.name}</strong>: {content}</p>
              <small>เกี่ยวกับเกม: {game.title}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>ไม่มีความคิดเห็น</p>
      )}
    </div>
  );
};

export default CommentsPage;
