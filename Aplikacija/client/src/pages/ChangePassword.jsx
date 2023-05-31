import React, {useState} from 'react'
import PrimaryButton from '../components/PrimaryButton'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {

  const [inputs, setInputs] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [err, setError] = useState(null)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        };

        await axios.patch(`http://localhost:5000/api/auth/update/password`, 
            inputs, 
            config
        ).then((response) => {
            toast.success(response.data.message)
            navigate('/posts')
        }).catch((err) => {
            setError(err.response.data.message)
        })
    } catch (err) {
        setError(err.response.data.message)
    }
  }

  console.log(inputs)

  return (
    <div className="py-[128px]">
      <div className="mx-auto w-[320px] sm:w-[480px] md:w-[728px] 2xl:w-[1200px]">
        <div className="p-12 shadow-lg">
          <h1 className="text-2xl font-black text-black">Promenite lozinku</h1>
          <form>
            <div className="grid grid-cols-1 gap-6 mt-4">
              <div>
                <label className="text-gray-500" htmlFor="phoneNumber">
                  Stara lozinka
                </label>
                <input
                  onChange={handleChange}
                  name="oldPassword"
                  type="password"
                  className="block w-full px-4 py-2 mt-2 border text-gray-900 outline-none rounded-md"
                />
              </div>
              <div>
                <label className="text-gray-500 dark:text-gray-200" htmlFor="description">
                 Nova lozinka
                </label>
                <input
                  onChange={handleChange}
                  name="newPassword"
                  type="password"
                  className="block w-full px-4 py-2 mt-2 border text-gray-900 outline-none rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-start mt-6">
              <PrimaryButton
                content="Promeni & Sacuvaj"
                onClick={handleSubmit}
                primaryColor="black"
                secondaryColor="white"
              />
            </div>
            {err && (
              <span className="text-red-500 block text-center bg-gray-200 py-4 mt-3">{err}</span>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword