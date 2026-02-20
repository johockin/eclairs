import SwiftUI
import WebKit
import UIKit

struct WebView: UIViewRepresentable {

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        // Enable localStorage persistence
        config.websiteDataStore = .default()

        // Register haptic message handler
        config.userContentController.add(context.coordinator, name: "haptic")

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.isScrollEnabled = true
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        // Disable long-press context menu
        webView.allowsLinkPreview = false

        // Load the bundled web app
        if let htmlURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") {
            webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlURL.deletingLastPathComponent())
        }

        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        // No dynamic updates needed
    }

    class Coordinator: NSObject, WKScriptMessageHandler {

        // Pre-instantiate generators to avoid first-fire delay
        private let lightImpact = UIImpactFeedbackGenerator(style: .light)
        private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
        private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
        private let notificationGenerator = UINotificationFeedbackGenerator()
        private let selectionGenerator = UISelectionFeedbackGenerator()

        override init() {
            super.init()
            // Prepare generators so first haptic fires instantly
            lightImpact.prepare()
            mediumImpact.prepare()
            heavyImpact.prepare()
            notificationGenerator.prepare()
            selectionGenerator.prepare()
        }

        func userContentController(
            _ userContentController: WKUserContentController,
            didReceive message: WKScriptMessage
        ) {
            guard message.name == "haptic",
                  let style = message.body as? String else { return }

            switch style {
            case "light":
                lightImpact.impactOccurred()
                lightImpact.prepare()
            case "medium":
                mediumImpact.impactOccurred()
                mediumImpact.prepare()
            case "heavy":
                heavyImpact.impactOccurred()
                heavyImpact.prepare()
            case "success":
                notificationGenerator.notificationOccurred(.success)
                notificationGenerator.prepare()
            case "error":
                notificationGenerator.notificationOccurred(.error)
                notificationGenerator.prepare()
            case "select":
                selectionGenerator.selectionChanged()
                selectionGenerator.prepare()
            default:
                break
            }
        }
    }
}
