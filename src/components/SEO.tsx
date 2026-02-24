import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
}

const SEO = ({ title, description, keywords }: SEOProps) => {
    useEffect(() => {
        // Update Document Title
        document.title = `${title} | Vikram Jadhav`;

        // Update Meta Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", description);
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = description;
            document.head.appendChild(meta);
        }

        // Update Meta Keywords
        if (keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute("content", keywords);
            } else {
                const meta = document.createElement("meta");
                meta.name = "keywords";
                meta.content = keywords;
                document.head.appendChild(meta);
            }
        }

        // Open Graph (Facebook/WhatsApp)
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", description);

    }, [title, description, keywords]);

    return null;
};

export default SEO;
