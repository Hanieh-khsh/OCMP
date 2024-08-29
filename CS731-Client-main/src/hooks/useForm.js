import { useState } from 'react';

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files ? files[0] : null;
      setFormValues((prevValues) => ({ ...prevValues, [name]: file }));
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  return [formValues, handleChange, errors, setFormValues];
};

export default useForm;
