import { router } from '@inertiajs/react';

export default function Pagination({ links, filters = {}, preserveScroll = true }) {
    if (!links || links.length <= 3) {
        return null;
    }

    const handleClick = (e, link) => {
        e.preventDefault();
        if (!link.url || link.active) return;

        // Parse the page number from the link URL
        const url = new URL(link.url, window.location.origin);
        const page = url.searchParams.get('page');

        // Build params with filters and page
        const params = { ...filters };
        if (page) params.page = page;

        router.get(window.location.pathname, params, {
            preserveScroll,
            preserveState: true,
        });
    };

    return (
        <div className="flex items-end justify-end gap-1 mt-6">
            {links.map((link, index) => {
                // Parse label to handle HTML entities
                const label = link.label
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»');

                return (
                    <button
                        key={index}
                        onClick={e => handleClick(e, link)}
                        disabled={!link.url || link.active}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg
                            transition-colors duration-200
                            ${link.active
                                ? 'bg-blue-600 text-white'
                                : link.url
                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                        `}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
}