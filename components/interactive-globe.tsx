"use client"

import { useEffect, useRef, useState } from "react"

interface InteractiveGlobeProps {
  width?: number
  height?: number
  className?: string
}

export function InteractiveGlobe({
  width = 300,
  height = 300,
  className = ""
}: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // High DPI support
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(dpr, dpr)

    let rotation = 0
    const centerX = width / 2
    const centerY = height / 2
    const radius = 110

    // ARGO float data for Indian Ocean
    const floats = [
      { lat: -10, lng: 70, name: "ARGO-1" },
      { lat: -20, lng: 80, name: "ARGO-2" },
      { lat: -15, lng: 90, name: "ARGO-3" },
      { lat: -25, lng: 75, name: "ARGO-4" },
      { lat: -5, lng: 65, name: "ARGO-5" },
      { lat: -30, lng: 85, name: "ARGO-6" }
    ]

    // Realistic Earth landmasses with Blue Marble colors
    const landmasses = [
      // AFRICA - Eastern coastline (Indian Ocean side)
      { lat: 37, lng: 10, size: 12, color: '#C4A875', type: 'desert' },   // North Africa/Sahara
      { lat: 32, lng: 22, size: 15, color: '#D4B896', type: 'desert' },   // Libya/Egypt
      { lat: 24, lng: 33, size: 13, color: '#E6C2A0', type: 'desert' },   // Egypt/Sudan
      { lat: 15, lng: 39, size: 10, color: '#8B9456', type: 'savanna' },  // Sudan/Ethiopia
      { lat: 8, lng: 40, size: 8, color: '#A0A855', type: 'savanna' },    // Ethiopia/Horn
      { lat: -1, lng: 42, size: 9, color: '#6B8E23', type: 'grassland' }, // Kenya
      { lat: -6, lng: 39, size: 7, color: '#658B3A', type: 'forest' },    // Tanzania
      { lat: -15, lng: 40, size: 8, color: '#5A7A32', type: 'forest' },   // Mozambique
      { lat: -26, lng: 32, size: 10, color: '#8B7355', type: 'mixed' },   // South Africa (east)
      { lat: -34, lng: 18, size: 12, color: '#A0895A', type: 'cape' },    // Cape of Good Hope

      // MADAGASCAR - Green tropical island
      { lat: -12, lng: 47, size: 4, color: '#2E8B57', type: 'tropical' },
      { lat: -18, lng: 47, size: 5, color: '#228B22', type: 'tropical' },
      { lat: -24, lng: 45, size: 4, color: '#32CD32', type: 'tropical' },

      // MIDDLE EAST - Desert regions
      { lat: 26, lng: 50, size: 10, color: '#DEB887', type: 'desert' },   // Saudi Arabia
      { lat: 29, lng: 48, size: 7, color: '#F4A460', type: 'desert' },    // Kuwait/Iraq
      { lat: 32, lng: 53, size: 8, color: '#D2B48C', type: 'desert' },    // Iran

      // INDIAN SUBCONTINENT - Green and brown mix
      { lat: 28, lng: 77, size: 18, color: '#8FBC8F', type: 'plains' },   // Northern India
      { lat: 23, lng: 78, size: 20, color: '#90EE90', type: 'fertile' },  // Central India
      { lat: 19, lng: 76, size: 16, color: '#ADFF2F', type: 'western' },  // Western Ghats
      { lat: 15, lng: 78, size: 14, color: '#7CFC00', type: 'south' },    // South India
      { lat: 11, lng: 76, size: 10, color: '#32CD32', type: 'kerala' },   // Kerala/Tamil Nadu
      { lat: 7, lng: 81, size: 4, color: '#00FF32', type: 'island' },     // Sri Lanka

      // SOUTHEAST ASIA - Tropical green
      { lat: 22, lng: 100, size: 10, color: '#228B22', type: 'tropical' },// Myanmar/Thailand
      { lat: 16, lng: 108, size: 8, color: '#32CD32', type: 'tropical' }, // Vietnam
      { lat: 4, lng: 102, size: 6, color: '#00FF00', type: 'tropical' },  // Malaysia
      { lat: -6, lng: 106, size: 8, color: '#00C851', type: 'tropical' }, // Java
      { lat: -8, lng: 115, size: 5, color: '#00E676', type: 'tropical' }, // Bali
      { lat: -2, lng: 117, size: 12, color: '#00C853', type: 'tropical' },// Borneo
      { lat: 1, lng: 124, size: 9, color: '#00E074', type: 'tropical' },  // Sulawesi
      { lat: -3, lng: 132, size: 8, color: '#00FF7F', type: 'tropical' }, // New Guinea

      // AUSTRALIA - Red/orange outback
      { lat: -12, lng: 131, size: 12, color: '#CD853F', type: 'outback' },// Northern Territory
      { lat: -17, lng: 122, size: 14, color: '#D2691E', type: 'outback' },// Western Australia
      { lat: -24, lng: 121, size: 11, color: '#F4A460', type: 'desert' }, // WA interior
      { lat: -32, lng: 116, size: 8, color: '#DEB887', type: 'coast' },   // Perth area
      { lat: -35, lng: 138, size: 12, color: '#CD853F', type: 'south' },  // South Australia
      { lat: -26, lng: 153, size: 10, color: '#8FBC8F', type: 'coast' },  // Queensland (green coast)
      { lat: -33, lng: 151, size: 9, color: '#90EE90', type: 'coast' },   // NSW (green)
      { lat: -38, lng: 145, size: 7, color: '#9ACD32', type: 'temperate'},// Victoria (green)
      { lat: -42, lng: 147, size: 5, color: '#6B8E23', type: 'island' },  // Tasmania

      // CHINA & EAST ASIA
      { lat: 39, lng: 116, size: 14, color: '#8FBC8F', type: 'plains' },  // Beijing/North China
      { lat: 31, lng: 121, size: 12, color: '#ADFF2F', type: 'fertile' }, // Yangtze River
      { lat: 23, lng: 113, size: 10, color: '#9ACD32', type: 'south' },   // South China

      // JAPAN
      { lat: 36, lng: 138, size: 6, color: '#228B22', type: 'temperate' },// Honshu
      { lat: 33, lng: 130, size: 4, color: '#32CD32', type: 'temperate' },// Kyushu
    ]

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Deep space background with stars
      const spaceGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 3)
      spaceGradient.addColorStop(0, 'rgba(10, 10, 40, 0.3)')
      spaceGradient.addColorStop(0.4, 'rgba(5, 5, 20, 0.8)')
      spaceGradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
      ctx.fillStyle = spaceGradient
      ctx.fillRect(0, 0, width, height)

      // Add some stars
      for (let i = 0; i < 50; i++) {
        const starX = (i * 123) % width
        const starY = (i * 456) % height
        if (Math.sqrt((starX - centerX) ** 2 + (starY - centerY) ** 2) > radius + 30) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 3) * 0.2})`
          ctx.beginPath()
          ctx.arc(starX, starY, 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Earth's realistic ocean gradient - Blue Marble style
      const oceanGradient = ctx.createRadialGradient(
        centerX - 35, centerY - 35, 0,
        centerX, centerY, radius
      )
      oceanGradient.addColorStop(0, '#40B5E8')    // Bright blue (sunlit water)
      oceanGradient.addColorStop(0.1, '#2E86AB')  // Medium blue
      oceanGradient.addColorStop(0.3, '#1B5299')  // Deeper blue
      oceanGradient.addColorStop(0.5, '#0D47A1')  // Deep ocean blue
      oceanGradient.addColorStop(0.7, '#0B2F5C')  // Dark blue
      oceanGradient.addColorStop(0.85, '#051E3E') // Very dark blue
      oceanGradient.addColorStop(1, '#020B1A')    // Near black (shadow)

      // Draw main Earth sphere
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = oceanGradient
      ctx.fill()

      // Add ocean texture/waves effect
      const waveGradient = ctx.createRadialGradient(
        centerX - 30, centerY - 30, 0,
        centerX, centerY, radius
      )
      waveGradient.addColorStop(0, 'rgba(135, 206, 250, 0.3)')
      waveGradient.addColorStop(0.3, 'rgba(70, 130, 180, 0.2)')
      waveGradient.addColorStop(0.6, 'rgba(25, 25, 112, 0.1)')
      waveGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)')

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = waveGradient
      ctx.fill()

      // Draw realistic landmasses with proper 3D projection
      landmasses.forEach(land => {
        const lng = (land.lng + rotation) % 360
        const lat = land.lat

        // 3D sphere projection
        const phi = (90 - lat) * Math.PI / 180
        const theta = lng * Math.PI / 180

        const x = Math.sin(phi) * Math.cos(theta)
        const y = Math.cos(phi)
        const z = Math.sin(phi) * Math.sin(theta)

        // Only draw if on visible hemisphere
        if (z > -0.1) {
          const screenX = centerX + x * radius * 0.94
          const screenY = centerY - y * radius * 0.94
          const depth = (z + 1) / 2 // 0 to 1 depth value

          // Apply realistic depth-based lighting
          const baseColor = land.color
          const r = parseInt(baseColor.slice(1, 3), 16)
          const g = parseInt(baseColor.slice(3, 5), 16)
          const b = parseInt(baseColor.slice(5, 7), 16)

          // More realistic lighting curve
          const lightness = Math.max(0.25, Math.pow(depth, 0.6) * 0.9 + 0.1)
          const shadedR = Math.floor(r * lightness)
          const shadedG = Math.floor(g * lightness)
          const shadedB = Math.floor(b * lightness)

          ctx.fillStyle = `rgb(${shadedR}, ${shadedG}, ${shadedB})`
          ctx.globalAlpha = Math.max(0.8, depth)

          // Draw landmass with slight blur effect for realism
          const landSize = land.size * Math.sqrt(depth) * 0.9
          ctx.beginPath()
          ctx.arc(screenX, screenY, landSize, 0, Math.PI * 2)
          ctx.fill()

          // Add subtle border/coastline
          if (depth > 0.5) {
            ctx.globalAlpha = depth * 0.3
            ctx.strokeStyle = `rgb(${Math.floor(shadedR * 0.7)}, ${Math.floor(shadedG * 0.7)}, ${Math.floor(shadedB * 0.7)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      ctx.globalAlpha = 1

      // Add realistic cloud formations
      const cloudPositions = [
        { lat: 0, lng: 80, size: 15, opacity: 0.6 },    // Equatorial clouds
        { lat: 10, lng: 60, size: 12, opacity: 0.5 },   // Monsoon clouds
        { lat: -10, lng: 90, size: 18, opacity: 0.7 },  // Indian Ocean clouds
        { lat: 20, lng: 70, size: 14, opacity: 0.4 },   // Northern Indian Ocean
        { lat: -20, lng: 100, size: 16, opacity: 0.6 }, // Southern clouds
        { lat: -30, lng: 80, size: 13, opacity: 0.5 },  // Southern Ocean
        { lat: 30, lng: 50, size: 11, opacity: 0.4 },   // Arabian Sea
        { lat: -5, lng: 110, size: 20, opacity: 0.8 },  // Tropical convergence
      ]

      cloudPositions.forEach(cloud => {
        const lng = (cloud.lng + rotation * 1.2) % 360 // Clouds move slightly faster
        const lat = cloud.lat

        const phi = (90 - lat) * Math.PI / 180
        const theta = lng * Math.PI / 180

        const x = Math.sin(phi) * Math.cos(theta)
        const y = Math.cos(phi)
        const z = Math.sin(phi) * Math.sin(theta)

        if (z > -0.05) {
          const screenX = centerX + x * radius * 0.98
          const screenY = centerY - y * radius * 0.98
          const depth = (z + 1) / 2

          // White clouds with realistic opacity
          const cloudGradient = ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, cloud.size * depth
          )
          cloudGradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * depth})`)
          cloudGradient.addColorStop(0.6, `rgba(245, 245, 245, ${cloud.opacity * depth * 0.7})`)
          cloudGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

          ctx.beginPath()
          ctx.arc(screenX, screenY, cloud.size * depth, 0, Math.PI * 2)
          ctx.fillStyle = cloudGradient
          ctx.fill()
        }
      })

      // Subtle lat/lng grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.3

      // Major latitude lines (Tropics, Equator, Arctic circles)
      const majorLats = [-66.5, -23.5, 0, 23.5, 66.5]
      majorLats.forEach(lat => {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        for (let lng = 0; lng <= 360; lng += 3) {
          const lngRot = (lng + rotation) % 360
          const phi = (90 - lat) * Math.PI / 180
          const theta = lngRot * Math.PI / 180

          const x = Math.sin(phi) * Math.cos(theta)
          const y = Math.cos(phi)
          const z = Math.sin(phi) * Math.sin(theta)

          if (z > -0.1) {
            const screenX = centerX + x * radius
            const screenY = centerY - y * radius
            if (lng === 0) ctx.moveTo(screenX, screenY)
            else ctx.lineTo(screenX, screenY)
          }
        }
        ctx.stroke()
      })

      // Prime meridian and international date line
      const majorLngs = [0, 180]
      majorLngs.forEach(lng => {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
        for (let lat = -90; lat <= 90; lat += 2) {
          const lngRot = (lng + rotation) % 360
          const phi = (90 - lat) * Math.PI / 180
          const theta = lngRot * Math.PI / 180

          const x = Math.sin(phi) * Math.cos(theta)
          const y = Math.cos(phi)
          const z = Math.sin(phi) * Math.sin(theta)

          if (z > -0.1) {
            const screenX = centerX + x * radius
            const screenY = centerY - y * radius
            if (lat === -90) ctx.moveTo(screenX, screenY)
            else ctx.lineTo(screenX, screenY)
          }
        }
        ctx.stroke()
      })

      // Draw ARGO floats with bright, realistic appearance
      floats.forEach((float, index) => {
        const lng = (float.lng + rotation) % 360
        const lat = float.lat

        const phi = (90 - lat) * Math.PI / 180
        const theta = lng * Math.PI / 180

        const x = Math.sin(phi) * Math.cos(theta)
        const y = Math.cos(phi)
        const z = Math.sin(phi) * Math.sin(theta)

        // Only show if on visible side
        if (z > -0.2) {
          const screenX = centerX + x * (radius + 12)
          const screenY = centerY - y * (radius + 12)
          const depth = (z + 1) / 2
          const opacity = Math.max(0.4, depth)

          // Enhanced pulsing animation
          const pulse = Math.sin(Date.now() * 0.004 + index * 1.2) * 0.4 + 0.6
          const size = 3 + pulse * 2

          // Outer glow (largest)
          ctx.globalAlpha = opacity * 0.15
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.arc(screenX, screenY, size * 2.5, 0, Math.PI * 2)
          ctx.fill()

          // Medium glow
          ctx.globalAlpha = opacity * 0.3
          ctx.fillStyle = '#FF8C00'
          ctx.beginPath()
          ctx.arc(screenX, screenY, size * 1.8, 0, Math.PI * 2)
          ctx.fill()

          // Main float body (bright)
          ctx.globalAlpha = opacity
          ctx.fillStyle = '#FF4500'
          ctx.beginPath()
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
          ctx.fill()

          // Bright inner core
          ctx.fillStyle = '#FFFF00'
          ctx.beginPath()
          ctx.arc(screenX, screenY, size * 0.5, 0, Math.PI * 2)
          ctx.fill()

          // White hot center
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(screenX, screenY, size * 0.2, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.globalAlpha = 1

      // Earth's atmosphere glow
      const atmoGradient = ctx.createRadialGradient(
        centerX, centerY, radius - 2,
        centerX, centerY, radius + 20
      )
      atmoGradient.addColorStop(0, 'rgba(135, 206, 250, 0)')
      atmoGradient.addColorStop(0.8, 'rgba(135, 206, 250, 0.2)')
      atmoGradient.addColorStop(0.95, 'rgba(100, 149, 237, 0.3)')
      atmoGradient.addColorStop(1, 'rgba(70, 130, 180, 0)')

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2)
      ctx.fillStyle = atmoGradient
      ctx.fill()

      // Sun reflection/specular highlight
      const specular = ctx.createRadialGradient(
        centerX - 45, centerY - 45, 0,
        centerX - 25, centerY - 25, 60
      )
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
      specular.addColorStop(0.3, 'rgba(255, 255, 255, 0.15)')
      specular.addColorStop(0.6, 'rgba(255, 255, 255, 0.05)')
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = specular
      ctx.fill()

      // Subtle terminator line (day/night boundary)
      const terminator = ctx.createLinearGradient(
        centerX + 30, centerY - 80,
        centerX + 80, centerY + 80
      )
      terminator.addColorStop(0, 'rgba(0, 0, 0, 0)')
      terminator.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)')
      terminator.addColorStop(1, 'rgba(0, 0, 0, 0.4)')

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = terminator
      ctx.fill()

      rotation += 0.12
      animationRef.current = requestAnimationFrame(animate)
    }

    setIsLoaded(true)
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height])

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))',
            display: isLoaded ? 'block' : 'none'
          }}
        />

        {!isLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="text-blue-300 text-sm animate-pulse">Loading Earth...</div>
          </div>
        )}

        {/* Info overlay */}
        <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs border border-orange-500/30 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Indian Ocean ARGO Floats</span>
          </div>
        </div>

        {/* Earth info */}
        <div className="absolute top-3 left-3 text-blue-300 text-xs opacity-80 select-none">
          🌍 Earth - Indian Ocean View
        </div>
      </div>
    </div>
  )
}