import { motion } from "motion/react";
import { useState } from "react";

type Props = {
    children: React.ReactNode;
};

const AnimatedSection = ({ children }: Props) => {
    const [hasAnimated, setHasAnimated] = useState(false);

    return (
        <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setHasAnimated(true)}
            transition={{ duration: 0.6, ease: "ease-out" }}
            viewport={{ amount: 0.3 }}
            style={{ opacity: hasAnimated ? 1 : undefined }} // mantener opacidad tras animación
            className="scroll-mt-10 grid md:grid-cols-2 gap-10 items-center"
        >
            {children}
        </motion.section>
    );
};

export default AnimatedSection;
