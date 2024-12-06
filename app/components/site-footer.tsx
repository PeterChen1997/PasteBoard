export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Paste Board. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
