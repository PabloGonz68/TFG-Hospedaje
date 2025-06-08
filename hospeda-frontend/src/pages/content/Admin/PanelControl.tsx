import UserDataTable from "@/components/tables/userDataTable"
import { Users } from "lucide-react"
const PanelControl = () => {
    return (


        <main className="p-4 max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <Users className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Panel de control para administradores</h1>
                            <p className="text-negro/80 mt-1">Administra todo en profundidad</p>
                        </div>
                    </div>
                </div>
                <section className="bg-blanco p-4 rounded-2xl">
                    <h2 className="text-xl font-semibold">Usuarios</h2>
                    <UserDataTable />
                </section>


            </div>
        </main>

    )
}

export default PanelControl