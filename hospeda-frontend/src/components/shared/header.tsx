import * as React from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import AuthBtn from "../buttons/authBtn";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { TicketModal } from "../modals/ticketsModal";
import { useLocation } from "react-router-dom";
import { GlowAvatar } from "../avatar/AdminAvatar";


const components: { title: string; href: string; description: string }[] = [
  {
    title: "¿Qué es Hospeda?",
    href: "/#que-es",
    description: "Una comunidad donde compartes tu casa y usas tickets para alojarte en otras.",
  },
  {
    title: "¿Cómo funciona?",
    href: "/#como-funciona",
    description: "Elige destino, usa tickets y hospédate fácilmente en casas de la comunidad.",
  },
  {
    title: "¿Cómo se usan los tickets?",
    href: "/#tickets",
    description: "Utiliza tickets de ciudad o pueblo para reservar noches según el tipo de destino.",
  },
  {
    title: "¿Cómo consigo tickets?",
    href: "/#conseguir-tickets",
    description: "Permite que otros se alojen en tu casa y gana tickets automáticamente.",
  },
  {
    title: "¿Puedo viajar con un grupo?",
    href: "/#viajar-grupo",
    description: "Forma grupos de viaje y repartan los tickets según el número de personas y noches.",
  },
  {
    title: "¿Cómo se gestionan las reservas?",
    href: "/#gestion-reservas",
    description: "Los anfitriones aceptan, completan o cancelan las reservas de forma sencilla.",
  },
];


export function NavigationMenuDemo() {
  const location = useLocation();
  // Variable para desactivar la animación en la ruta de perfil
  const disableScrollAnimation = location.pathname.startsWith("/perfil");


  const { logout, isAuthenticated, loading, user } = useAuth() ?? {};
  const [scrolled, setScrolled] = useState(false);
  //Esto sirve para saber si el usuario ha llegado a la mitad de la pantalla, cambiar el tipo de header
  useEffect(() => {
    if (disableScrollAnimation) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const passedHalfHero = heroRect.bottom < window.innerHeight / 2;
        setScrolled(passedHalfHero);
      } else {
        const passedHalfScreen = window.scrollY > window.innerHeight / 2;
        setScrolled(passedHalfScreen);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }

  }, []);

  const [ticketsCiudad, setTicketsCiudad] = useState(0);
  const [ticketsPueblo, setTicketsPueblo] = useState(0);
  console.log("User en el componente NavigationMenuDemo:", user);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      try {
        console.log("Intentando obtener tickets para user ID:", user?.id_usuario);

        const response = await fetch(`http://localhost:8080/ticket/user/${user?.id_usuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }); if (response.ok) {
          const data = await response.json();

          const ciudad = data.filter((ticket: any) => ticket.tipoTicket === "CIUDAD").length;
          const pueblo = data.filter((ticket: any) => ticket.tipoTicket === "PUEBLO").length;

          console.log("Tickets obtenidos:", data);
          setTicketsCiudad(ciudad || 0);
          setTicketsPueblo(pueblo || 0);
          console.log("Tickets CIUDAD:", ciudad, "Tickets PUEBLO:", pueblo);
        } else {
          console.error("Error al obtener los tickets");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.id_usuario) {
      fetchTickets();
    } else {
      console.log("No se ha obtenido aún el ID del usuario");
    }
  }, [user?.id_usuario]);



  if (loading) return (

    <span className="loading-text">Cargando...</span>


  );

  return (
    <main className="transition-all duration-700 flex justify-center items-center w-full fixed top-0 z-50">


      <header
        className={cn(
          "transition-all duration-300 flex items-center",
          scrolled
            ? "bg-negro/60 backdrop-blur-md mt-5 rounded-3xl px-2 md:px-5 lg:px-35 py-2 max-w-full gap-10  md:gap-20 lg:gap-30"
            : "py-4 w-full gap-10 justify-center sm:justify-between px-10 lg:px-30"
        )}
      >
        <div>
          <a href="/">
            <img className=" min-w-24 md:min-w-32 max-w-24 md:max-w-32" src="https://i.ibb.co/rKGbXzxS/logo-Hospeda-amarillo.png" alt="logo-Hospeda-amarillo" />
          </a>
        </div>

        <NavigationMenu className="bg-negro p-2 rounded-lg ">
          <NavigationMenuList className=" flex flex-col md:flex-row items-center">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xs md:text-sm">¿Como funciona?</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end items-center md:items-start rounded-md bg-gradient-to-b from-blanco/50 to-secundario p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <img className="w-44" src="https://i.ibb.co/XkKPrxRK/logo-Hospeda-negro.png" alt="Logo Hospeda en negro" />

                        <div className="mb-2 mt-4 text-lg font-medium">
                          ¿Como empezar?
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Hospeda y obten hospedaje a cambio.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/hospedajes" title="Hospedajes">
                    Descubre nuevos lugares para hospedarte.
                  </ListItem>
                  <ListItem href="/grupoViaje/mis-grupos" title="Grupos de Viajes">
                    Crea o gestiona el grupo con el que deseas viajar.
                  </ListItem>
                  <ListItem href="/reserva/mis-reservas" title="Reservas">
                    Gestiona las reservas de tus viajes.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xs md:text-sm">Información</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="https://github.com/PabloGonz68/TFG-Hospedaje" target="_blank" className={navigationMenuTriggerStyle()}>
                Documentación
              </NavigationMenuLink>          </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>



        <div className="hidden lg:flex items-center">
          {isAuthenticated ? (
            <div className="flex justify-center items-center w-[120px] gap-2">
              <TicketModal ticketsCiudad={ticketsCiudad} ticketsPueblo={ticketsPueblo} />
              <a href="/perfil" className="bg-white flex items-center justify-center border border-gray-400 min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px] rounded-4xl overflow-hidden">
                {user?.rol === 'ADMIN' ? (<GlowAvatar
                  src={
                    user?.fotoPerfil
                      ? user.fotoPerfil
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=random`
                  }
                  alt="Avatar"
                />) : (<img
                  title="Perfil"
                  src={user?.fotoPerfil
                    ? user.fotoPerfil
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=random`}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full aspect-square"
                />)}



              </a>
              <button onClick={logout}>
                <AuthBtn color="rgb(255, 65, 65)" icon="logout" text="Cerrar sesión" enlace="/login" />
              </button>

            </div>
          ) : (
            <div className="flex justify-center items-center w-[120px] gap-2">
              <AuthBtn color="rgb(2, 35, 65)" icon="login" text="Iniciar sesión" enlace="/login" />
              <AuthBtn color="rgb(55, 245, 65)" icon="register" text="Registrarse" enlace="/register" />
            </div>
          )}



        </div>
        {/* Botón hamburguesa visible solo en pantallas pequeñas */}
        <label className="flex flex-col gap-2 w-8 cursor-pointer lg:hidden relative z-50">
          <input id="menu-toggle" type="checkbox" className="peer hidden" />
          <div className="rounded-2xl h-[3px] w-1/2 bg-black duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px]" />
          <div className="rounded-2xl h-[3px] w-full bg-black duration-500 peer-checked:-rotate-45" />
          <div className="rounded-2xl h-[3px] w-1/2 bg-black duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[12px] peer-checked:translate-y-[1px]" />

          {/* Contenedor del menú móvil */}
          <div className="peer-checked:flex hidden absolute top-10 right-0 bg-white text-black flex-col gap-4 rounded-xl shadow-md w-60">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center bg-gray-500 text-principal p-2 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Acciones</h2>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <TicketModal ticketsCiudad={ticketsCiudad} ticketsPueblo={ticketsPueblo} />

                  <a className="flex items-center gap-2" href="/perfil">
                    <div className="bg-white flex items-center justify-center border border-gray-400 min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px] rounded-4xl overflow-hidden">
                      {user?.rol === 'ADMIN' ? (<GlowAvatar
                        src={
                          user?.fotoPerfil
                            ? user.fotoPerfil
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=random`
                        }
                        alt="Avatar"
                      />) : (<img
                        title="Perfil"
                        src={user?.fotoPerfil
                          ? user.fotoPerfil
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=random`}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full aspect-square"
                      />)}
                    </div>
                    <h2 className="text-lg font-semibold">Perfil</h2>
                  </a>

                  <button onClick={logout}>
                    <AuthBtn color="rgb(255, 65, 65)" icon="logout" text="Cerrar sesión" enlace="/login" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center bg-principal text-white p-2 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Acceso</h2>
                </div>
                <div className="flex flex-col gap-2 p-4">

                  <AuthBtn color="rgb(2, 35, 65)" icon="login" text="Iniciar sesión" enlace="/login" />
                  <AuthBtn color="rgb(55, 245, 65)" icon="register" text="Registrarse" enlace="/register" />
                </div>
              </div>
            )}
          </div>
        </label>




      </header>
    </main>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>

  )
})
ListItem.displayName = "ListItem"

export default NavigationMenuDemo;