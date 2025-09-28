"use client"

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

interface FloatData {
  float_serial_no: string
  latitude: string
  longitude: string
  date_creation: string
  detail: string
}

interface ArgoMapProps {
  className?: string
}

// Create the map component that only runs on client
function ArgoMapComponent({ className = "" }: ArgoMapProps) {
  const [floatData, setFloatData] = useState<FloatData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const initializationRef = useRef(false)

  // Load float data
  useEffect(() => {
    const loadFloatData = async () => {
      try {
        console.log('Fetching float data from /transformed_data.json...')
        const response = await fetch('/transformed_data.json')

        if (!response.ok) {
          throw new Error(`Failed to load float data: ${response.status} ${response.statusText}`)
        }

        const data: FloatData[] = await response.json()
        console.log('Successfully loaded float data:', data.length, 'floats')

        if (!data || data.length === 0) {
          throw new Error('No float data found in the JSON file')
        }

        setFloatData(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading float data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load map data')
        setIsLoading(false)
      }
    }

    loadFloatData()
  }, [])

  // Initialize map when data is ready
  useEffect(() => {
    if (!floatData.length || typeof window === 'undefined' || !mapContainerRef.current) return
    if (initializationRef.current) return

    const initializeMap = async () => {
      try {
        console.log('Initializing map...')
        initializationRef.current = true

        const mapContainer = mapContainerRef.current
        if (!mapContainer) return

        // Clean up any existing map
        if (mapRef.current) {
          console.log('Removing existing map instance...')
          try {
            mapRef.current.remove()
          } catch (e) {
            console.log('Error removing map:', e)
          }
          mapRef.current = null
        }

        // Clear container
        mapContainer.innerHTML = ''
        delete (mapContainer as any)._leaflet_id

        // Small delay to ensure cleanup
        await new Promise(resolve => setTimeout(resolve, 100))

        // Import Leaflet
        const L = (await import('leaflet')).default

        // Import CSS if not already present
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          link.crossOrigin = ''
          document.head.appendChild(link)
        }

        // Initialize map
        const map = L.map(mapContainer).setView([0, 60], 3)
        mapRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 2
        }).addTo(map)

        // Custom icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      width: 12px; height: 12px; border-radius: 50%;
                      border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -8]
        })

        // Date formatting
        function formatDate(dateString: string) {
          const date = new Date(dateString)
          const day = String(date.getDate()).padStart(2, '0')
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const year = date.getFullYear()
          return `${day}/${month}/${year}`
        }

        // Popup content
        function createPopupContent(floatData: FloatData) {
          // Extract platform type and cycle from detail string
          const platformMatch = floatData.detail.match(/\(([^)]+)\)/)
          const cycleMatch = floatData.detail.match(/cycle (\d+)/)
          const projectMatch = floatData.detail.match(/under ([^\s]+)/)
          const piMatch = floatData.detail.match(/by ([^\s]+)/)

          const platformType = platformMatch ? platformMatch[1] : 'Unknown'
          const cycleNumber = cycleMatch ? cycleMatch[1] : 'N/A'
          const projectName = projectMatch ? projectMatch[1] : 'Unknown'
          const piName = piMatch ? piMatch[1] : 'Unknown'

          return `
            <div class="popup-content">
              <div class="popup-header">Float #${floatData.float_serial_no}</div>
              <div class="popup-row">
                <span class="popup-label">Platform:</span>
                <span class="popup-value">${platformType}</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Project:</span>
                <span class="popup-value">${projectName}</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">PI:</span>
                <span class="popup-value">${piName}</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Cycle:</span>
                <span class="popup-value">#${cycleNumber}</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Latitude:</span>
                <span class="popup-value">${parseFloat(floatData.latitude).toFixed(6)}°</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Longitude:</span>
                <span class="popup-value">${parseFloat(floatData.longitude).toFixed(6)}°</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Last Update:</span>
                <span class="popup-value">${formatDate(floatData.date_creation)}</span>
              </div>
            </div>
          `
        }

        // Add markers
        const bounds: [number, number][] = []

        floatData.forEach(floatData => {
          const lat = parseFloat(floatData.latitude)
          const lng = parseFloat(floatData.longitude)

          if (isNaN(lat) || isNaN(lng)) return

          console.log('Adding marker at:', lat, lng, 'for float:', floatData.float_serial_no)

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
          const popupContent = createPopupContent(floatData)

          marker.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'custom-popup'
          })

          // Hover interactions
          marker.on('mouseover', function(e) {
            this.openPopup()
          })

          marker.on('mouseout', function(e) {
            setTimeout(() => {
              if (!this.isPopupOpen() || !this.getPopup().getElement()?.matches(':hover')) {
                this.closePopup()
              }
            }, 100)
          })

          bounds.push([lat, lng])
        })

        // Fit bounds
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] })
        }

        // Popup interactions
        map.on('popupopen', function(e) {
          const popup = e.popup.getElement()
          if (popup) {
            popup.addEventListener('mouseenter', function() {
              ;(e.popup as any).options.keepOpen = true
            })

            popup.addEventListener('mouseleave', function() {
              ;(e.popup as any).options.keepOpen = false
              e.popup.close()
            })
          }
        })

        console.log(`Added ${bounds.length} markers to the map`)

      } catch (error) {
        console.error('Error initializing map:', error)
        setError('Failed to initialize map: ' + (error as Error).message)
        initializationRef.current = false
      }
    }

    initializeMap()
  }, [floatData])

  // Cleanup function
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up map...')
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (e) {
          console.log('Error during cleanup:', e)
        }
        mapRef.current = null
      }
      initializationRef.current = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className={`${className} rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50`}>
        <div className="text-gray-500">Loading map data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} rounded-lg border-2 border-red-200 flex items-center justify-center bg-red-50`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <>
      {/* Popup styles */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-content {
          margin: 15px;
          font-size: 14px;
        }
        .popup-content {
          min-width: 250px;
          max-width: 350px;
        }
        .popup-header {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e0e0e0;
          word-wrap: break-word;
          word-break: break-word;
        }
        .popup-row {
          display: flex;
          margin: 8px 0;
          gap: 8px;
        }
        .popup-label {
          font-weight: 600;
          color: #555;
          min-width: 90px;
          flex-shrink: 0;
        }
        .popup-value {
          color: #333;
          flex: 1;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        .popup-detail {
          margin-top: 12px;
          padding: 10px;
          background: #f5f7fa;
          border-radius: 8px;
          color: #444;
          font-style: italic;
          line-height: 1.4;
          word-wrap: break-word;
          word-break: break-word;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className={`${className} rounded-lg border-2 border-gray-200 overflow-hidden`}
        style={{ minHeight: '400px' }}
      />
    </>
  )
}

// Export with dynamic import to prevent SSR issues
export const ArgoMap = dynamic(() => Promise.resolve(ArgoMapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})