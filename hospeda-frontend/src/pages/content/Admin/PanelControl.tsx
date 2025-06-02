import TopLayout from "@/layouts/TopLayout"
import UserDataTable from "@/components/tables/userDataTable"
const PanelControl = () => {
    return (
        <TopLayout>

            <main className="p-4 max-w-3xl mx-auto">
                <UserDataTable />
                <p className="text-2xl">Panel de control solo para ADMIN</p>

            </main>
        </TopLayout>
    )
}

export default PanelControl