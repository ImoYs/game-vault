// components/Alert.tsx
import ReactDOM from 'react-dom';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    // ตรวจสอบว่าเราอยู่ใน browser environment หรือไม่ (สำหรับ Next.js)
    if (typeof window === 'undefined') {
        return null;
    }
  return ReactDOM.createPortal(
    <div
      className={`fixed top-0 left-0 w-full z-50 border px-4 py-3 rounded  ${
        type === 'success'
          ? 'bg-green-100 border-green-400 text-green-700'
          : 'bg-red-100 border-red-400 text-red-700'
      }`}
      role="alert"
    >
      <strong className="font-bold">{type === 'success' ? 'Success!' : 'Error!'}</strong>
      <span className="block sm:inline"> {message}</span>
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        × {/* หรือ icon ปิดอื่นๆ */}
      </button>
    </div>,
    document.body // Render เข้าไปใน document.body
  );
};

export default Alert;