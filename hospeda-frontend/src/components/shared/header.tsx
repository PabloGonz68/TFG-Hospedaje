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


const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export function NavigationMenuDemo() {
  const { logout, isAuthenticated, loading, user } = useAuth() ?? {};
  const [scrolled, setScrolled] = useState(false);
  //Esto sirve para saber si el usuario ha llegado a la mitad de la pantalla, cambiar el tipo de header
  useEffect(() => {
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
          "transition-all duration-300 flex items-center  shadow-md",
          scrolled
            ? "bg-negro/60 backdrop-blur-md mt-5 rounded-3xl px-20 py-2 max-w-fit gap-30"
            : "bg-negro py-4 w-full justify-between px-30"
        )}
      >
        <div>
          <a href="/">
            <img className="w-32" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
          </a>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>¿Como funciona?</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />

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
              <NavigationMenuTrigger>Información</NavigationMenuTrigger>
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



        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex justify-center items-center w-[120px] gap-2">
              <TicketModal ticketsCiudad={ticketsCiudad} ticketsPueblo={ticketsPueblo} />
              <a href="/perfil" className="bg-white flex items-center justify-center border border-gray-400 min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px] rounded-4xl overflow-hidden">
                <img
                  title="Perfil"
                  src={user?.fotoPerfil
                    ? user.fotoPerfil
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=random`}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full aspect-square"
                />
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