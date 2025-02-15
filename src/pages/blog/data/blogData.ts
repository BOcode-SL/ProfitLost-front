import { BlogPost } from "../../../types/models/blogPost";

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Bienvenido a Profit&Lost 💸",
        excerpt: "Os presentamos la nueva app para gestionar vuestros gastos",
        content: `
            <p>🚀 ¡Hola! Hoy vengo a presentar Profit&Lost 🚀</p>

            <p>¿Alguna vez has tenido que lidiar con hojas de Excel interminables para gestionar tus finanzas? 💸 Yo también… y por eso creé Profit&Lost: una herramienta sencilla, visual y poderosa para que tomes el control de tu dinero.</p>

            <h3>💡 Nuestra historia:</h3>
            <p>Nació como un proyecto personal para resolver mi propio caos financiero. Hoy, gracias al feedback de testers increíbles, es una app lista para ayudar a más personas como tú.</p>

            <h3>🌟 ¿Cuáles son nuestras características?</h3>
            <ul>
                <li>✅ Categorías personalizadas: Organiza tus gastos en trabajo, casa, supermercado y más.</li>
                <li>✅ Visualización anual y mensual: Analiza tus finanzas a corto y largo plazo.</li>
                <li>✅ Gestión de cuentas: Para ver todo tu saldo total en un solo lugar.</li>
                <li>✅ Pronto tendremos: Sección de metas financieras y Sección de seguimiento de inversiones.</li>
            </ul>

            <p>👉 ¿Te gustaría probarla? Estamos cerca del lanzamiento público. Síguenos para ser de los primeros en descubrirla.</p>

            <p>🔗 <a href="https://profit-lost.com">profit-lost.com</a></p>
        `,
        date: "2024-03-20",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1739636810/blog/fefy4e0cgpnt0tjfornm.jpg",
        author: "Profit&Lost Team",
        contentType: 'html'
    },
    {
        id: 2,
        title: "Cómo organizar tus gastos mensuales con Profit&Lost",
        excerpt: "Os presentamos la nueva app para gestionar vuestros gastos",
        content: `
            <p>¿Te cuesta controlar tus gastos mensuales? 💸 ¿Quieres saber en qué se te va el dinero y cómo puedes ahorrar más? 💰 En Profit&Lost, hemos diseñado una herramienta sencilla y visual para ayudarte a organizar tus finanzas. En este tutorial, te explicamos paso a paso cómo hacerlo.</p>

            <h3>Paso 1: Crea tu cuenta y personaliza tus categorías</h3>
            <ul>
                <li>Regístrate en <a href="https://profit-lost.com/auth">profit-lost.com/auth</a> ⛓️‍💥</li>
                <li>Una vez dentro, ve a la sección de Categorías y crea las que mejor se adapten a tus gastos (ej: trabajo, casa, supermercado, ocio, etc.). 🎨</li>
                <li>Personaliza los colores de cada categoría para identificarlas fácilmente. 🌈</li>
            </ul>

            <h3>Paso 2: Añade tus ingresos y gastos</h3>
            <ul>
                <li>Dirígete a la sección de Transacciones. 📊</li>
                <li>Añade tus ingresos (salario, freelance, etc.) y tus gastos (compras, facturas, etc.). 🏦</li>
                <li>Asigna cada transacción a la categoría correspondiente. 🏷️</li>
            </ul>

            <h3>Paso 3: Visualiza y analiza tus finanzas</h3>
            <ul>
                <li>En la sección de Visualización Mensual, verás un gráfico que muestra tus ingresos vs. gastos. 📈</li>
                <li>Identifica en qué categorías gastas más y ajusta tu presupuesto si es necesario. ⚖️</li>
            </ul>

            <h3>Paso 4: Establece metas y ahorra</h3>
            <ul>
                <li>Próximamente, podrás usar la sección de Goals para fijar metas financieras (ej: ahorrar para un viaje ✈️ o pagar deudas). 💳</li>
                <li>Revisa tu progreso mensualmente y celebra tus logros. 🎉</li>
            </ul>

            <h3>Consejos adicionales</h3>
            <ul>
                <li>Revisa tus transacciones semanalmente para mantener el control. 📅</li>
                <li>Usa la sección de Notas para anotar detalles importantes (ej: "Este mes gasté más en ocio"). 📝</li>
            </ul>

            <p>👉 ¿Listo para tomar el control de tus finanzas? Prueba Profit&Lost hoy mismo y descubre lo fácil que puede ser. 🚀</p>
        `,
        date: "2025-02-15",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1739553639/AppPhotos/Brand/mockup/annualreport.png",
        author: "Profit&Lost Team",
        contentType: 'html'
    }
];