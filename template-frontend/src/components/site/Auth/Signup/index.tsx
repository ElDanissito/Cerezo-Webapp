"use client";

import Breadcrumb from "@/components/site/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (name: string, value: string) => {
    let errorMsg = "";
    
    if (name === "name") {
      if (!value.trim()) {
        errorMsg = "El nombre completo es requerido";
      } else if (value.trim().length < 3) {
        errorMsg = "El nombre debe tener al menos 3 caracteres";
      }
    }
    
    if (name === "email") {
      if (!value.trim()) {
        errorMsg = "El correo electrónico es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = "Ingresa un correo electrónico válido";
      }
    }
    
    if (name === "password") {
      if (!value.trim()) {
        errorMsg = "La contraseña es requerida";
      } else if (value.length < 6) {
        errorMsg = "La contraseña debe tener al menos 6 caracteres";
      }
    }
    
    if (name === "confirmPassword") {
      if (!value.trim()) {
        errorMsg = "Debes confirmar tu contraseña";
      } else if (value !== formData.password) {
        errorMsg = "Las contraseñas no coinciden";
      }
    }
    
    return errorMsg;
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError("");
    
    try {
      // TODO: Integrar con el backend Django para autenticación con Google
      // Por ahora, redirigir a la URL de OAuth de Google
      // Esta URL debería ser proporcionada por tu backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      window.location.href = `${backendUrl}/api/auth/google/signup`;
    } catch (err) {
      setError("Error al iniciar sesión con Google. Intenta nuevamente.");
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar en tiempo real si las contraseñas coinciden
    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword;
      
      if (confirmPassword.length > 0) {
        setPasswordMatch(password === confirmPassword);
      } else {
        setPasswordMatch(true);
      }
    }

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validar todos los campos
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    const confirmPasswordError = validateField("confirmPassword", formData.confirmPassword);

    setFieldErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Si hay errores, no enviar
    if (nameError || emailError || passwordError || confirmPasswordError) {
      setError("Por favor corrige los errores antes de continuar");
      return;
    }

    setIsLoading(true);

    // Aquí iría la lógica para enviar el formulario al backend
    console.log("Formulario válido:", formData);
    setIsLoading(false);
  };

  return (
    <>
      <Breadcrumb title={"Registro"} pages={["Registro"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Crear una Cuenta
              </h2>
              <p>Ingresa tus datos a continuación</p>
            </div>

            <div className="flex flex-col gap-4.5">
              <button 
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                  <g clipPath="url(#clip0_98_7461)">
                    <mask
                      id="mask0_98_7461"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    >
                      <path d="M20 0H0V20H20V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_98_7461)">
                      <path
                        d="M19.999 10.2218C20.0111 9.53429 19.9387 8.84791 19.7834 8.17737H10.2031V11.8884H15.8267C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.999 13.2661 19.999 10.2218Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2036 20C12.9586 20 15.2715 19.1111 16.9609 17.5777L13.7409 15.1332C12.8793 15.7223 11.7229 16.1333 10.2036 16.1333C8.91317 16.126 7.65795 15.7206 6.61596 14.9746C5.57397 14.2287 4.79811 13.1802 4.39848 11.9777L4.2789 11.9877L1.12906 14.3766L1.08789 14.4888C1.93622 16.1457 3.23812 17.5386 4.84801 18.512C6.45791 19.4852 8.31194 20.0005 10.2036 20Z"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39899 11.9776C4.1758 11.3411 4.06063 10.673 4.05807 9.9999C4.06218 9.3279 4.1731 8.66067 4.38684 8.02221L4.38115 7.88959L1.1927 5.46234L1.0884 5.51095C0.372762 6.90337 0 8.44075 0 9.99983C0 11.5589 0.372762 13.0962 1.0884 14.4887L4.39899 11.9776Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2039 3.86663C11.6661 3.84438 13.0802 4.37803 14.1495 5.35558L17.0294 2.59997C15.1823 0.90185 12.7364 -0.0298855 10.2039 -3.67839e-05C8.31239 -0.000477835 6.45795 0.514733 4.84805 1.48799C3.23816 2.46123 1.93624 3.85417 1.08789 5.51101L4.38751 8.02225C4.79107 6.82005 5.5695 5.77231 6.61303 5.02675C7.65655 4.28119 8.91254 3.87541 10.2039 3.86663Z"
                        fill="#EB4335"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_98_7461">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                )}
                {isGoogleLoading ? "Conectando..." : "Registrarse con Google"}
              </button>
            </div>

            <span className="relative z-1 block font-medium text-center mt-4.5">
              <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>
              <span className="inline-block px-3 bg-white">O</span>
            </span>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-5 p-3 rounded-lg bg-red/10 border border-red/20 text-red text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Nombre Completo <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingresa tu nombre completo"
                    className={`rounded-lg border ${
                      touched.name && fieldErrors.name
                        ? "border-red focus:ring-red/20"
                        : "border-gray-3 focus:ring-blue/20"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2`}
                    required
                  />
                  {touched.name && fieldErrors.name && (
                    <p className="text-red text-sm mt-1.5">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Correo Electrónico <span className="text-red">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingresa tu correo electrónico"
                    className={`rounded-lg border ${
                      touched.email && fieldErrors.email
                        ? "border-red focus:ring-red/20"
                        : "border-gray-3 focus:ring-blue/20"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2`}
                    required
                  />
                  {touched.email && fieldErrors.email && (
                    <p className="text-red text-sm mt-1.5">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Contraseña <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      touched.password && fieldErrors.password
                        ? "border-red focus:ring-red/20"
                        : "border-gray-3 focus:ring-blue/20"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2`}
                    required
                  />
                  {touched.password && fieldErrors.password && (
                    <p className="text-red text-sm mt-1.5">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Confirmar Contraseña <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirma tu contraseña"
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      (touched.confirmPassword && fieldErrors.confirmPassword) || (!passwordMatch && formData.confirmPassword.length > 0)
                        ? "border-red focus:ring-red/20"
                        : "border-gray-3 focus:ring-blue/20"
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2`}
                    required
                  />
                  {touched.confirmPassword && fieldErrors.confirmPassword && (
                    <p className="text-red text-sm mt-1.5">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </button>

                <p className="text-center mt-6">
                  ¿Ya tienes una cuenta?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Inicia Sesión
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
