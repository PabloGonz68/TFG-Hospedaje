import TopLayout from "@/layouts/TopLayout"
import UserDataTable from "@/components/tables/userDataTable"
const PanelControl = () => {
    return (
        <TopLayout>

            <main className="p-4 max-w-3xl mx-auto">
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Panel de control para administradores</h1>
                    <section>
                        <h2 className="text-xl font-semibold">Usuarios</h2>
                        <UserDataTable />
                    </section>


                </div>
            </main>
        </TopLayout>
    )
}

export default PanelControl