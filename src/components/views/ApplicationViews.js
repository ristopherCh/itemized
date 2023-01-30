import { Route, Routes } from "react-router-dom"
import { Home } from "../Home/Home"
import { AllItems } from "../items/AllItems"
import { NewItem } from "../items/NewItem"
import { AllProjects } from "../projects/AllProjects"
import { NewProject } from "../projects/NewProject"

export const ApplicationViews = () => {
	return (
	<Routes>
		<Route path="/" element={<Home />} />
		<Route path="/projects" element={<AllProjects />} />
		<Route path="/items" element={<AllItems />} />
		<Route path="/projects/new" element={<NewProject />} />
		<Route path="/items/new" element={<NewItem />} />

	</Routes>
	)
}

