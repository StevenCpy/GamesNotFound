import { useState, useEffect, useRef, createContext } from 'react'
import './Ostrich Run.css'

// UI Sub-components
import GameButton from "./components/GameButton"

// Individual Asset Imports
import ostrichRun0 from "./assets/ostrich_run_0.png"
import ostrichRun1 from "./assets/ostrich_run_1.png"
import ostrichRun2 from "./assets/ostrich_run_2.png"
import ostrichRun3 from "./assets/ostrich_run_3.png"
import ostrichDuckImg from "./assets/ostrich_duck.png"

import cactusSmallImg from "./assets/cactus_small.png"
import cactusClusterImg from "./assets/cactus_cluster.png"
import vultureEnemyImg from "./assets/vulture_enemy.png"

type GameStatusContextType = {
	isGameOn: boolean
}

const GameStatusContext = createContext<GameStatusContextType | null>(null)

type Obstacle = {
	id: number
	type: 'cactus-small' | 'cactus-cluster' | 'vulture'
	laneIndex: number
	y: number
	vy: number
	width: number
	height: number
	image: string
}

type OstrichRunProps = {
	submitScore?: (score: number) => void
}

export default function OstrichRun({ submitScore }: OstrichRunProps) {
	const [score, setScore] = useState(0)
	const [lives, setLives] = useState(3)
	const [isGameOn, setIsGameOn] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [isPaused, setIsPaused] = useState(false)

	// Character State & Movement
	const [runFrame, setRunFrame] = useState(0)
	const [currentLane, setCurrentLane] = useState(1) // 0: Left, 1: Center, 2: Right
	const [isDucking, setIsDucking] = useState(false)

	// Layout & Dynamic Sizing
	const [playableAreaSize, setPlayableAreaSize] = useState({ width: 0, height: 0 })
	const playableAreaRef = useRef<HTMLDivElement | null>(null)

	const [obstacles, setObstacles] = useState<Obstacle[]>([])

	// Use refs for loop-dependent states to avoid stale closures and timer issues
	const isGameOnRef = useRef(isGameOn)
	isGameOnRef.current = isGameOn

	const isPausedRef = useRef(isPaused)
	isPausedRef.current = isPaused

	const scoreRef = useRef(score)
	scoreRef.current = score

	const playableHeightRef = useRef(playableAreaSize.height)
	playableHeightRef.current = playableAreaSize.height

	const heroWidth = 70
	const heroHeight = isDucking ? 45 : 85

	// Compute responsive lane X positions matching smaller side margins (30px default, 10px on mobile)
	const getLaneX = (laneIdx: number) => {
		const totalWidth = playableAreaSize.width || 600
		const sideMargin = totalWidth <= 480 ? 20 : 60
		const availableWidth = totalWidth - (sideMargin * 2)
		const laneWidth = availableWidth / 3
		return sideMargin + laneWidth * laneIdx + laneWidth / 2 - heroWidth / 2
	}

	// Resize Observer
	useEffect(() => {
		if (!playableAreaRef.current) return

		const resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0]
			setPlayableAreaSize({
				width: entry.contentBoxSize[0].inlineSize,
				height: entry.contentBoxSize[0].blockSize,
			})
		})

		resizeObserver.observe(playableAreaRef.current)
		return () => resizeObserver.disconnect()
	}, [])

	// Page Visibility Change Listener to Pause Game when switching tabs
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden && isGameOnRef.current && !isGameOver) {
				setIsPaused(true)
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	}, [isGameOver])

	// Running Animation Frame Cycle
	useEffect(() => {
		if (!isGameOn || isPaused || isDucking) return

		const animInterval = setInterval(() => {
			setRunFrame((prev) => (prev + 1) % 4)
		}, 110)

		return () => clearInterval(animInterval)
	}, [isGameOn, isPaused, isDucking])

	// Continuous Score Counter
	useEffect(() => {
		if (!isGameOn || isPaused) return
		const scoreInterval = setInterval(() => {
			setScore((prev) => prev + 10)
		}, 120)

		return () => clearInterval(scoreInterval)
	}, [isGameOn, isPaused])

	// Stable Spawner Interval
	useEffect(() => {
		if (!isGameOn) return

		const spawnInterval = setInterval(() => {
			if (!isGameOnRef.current || isPausedRef.current || playableHeightRef.current === 0) return

			const lanesCountToSpawn = Math.random() < 0.5 ? 1 : 2
			const shuffledLanes = [0, 1, 2].sort(() => Math.random() - 0.5)
			const selectedLanes = shuffledLanes.slice(0, lanesCountToSpawn)

			const newObstacles: Obstacle[] = selectedLanes.map((laneIdx) => {
				const randType = Math.random()
				let obstacleType: Obstacle['type'] = 'cactus-small'
				let obsWidth = 60
				let obsHeight = 70
				let obsImage = cactusSmallImg

				if (randType > 0.55) {
					obstacleType = 'vulture'
					obsWidth = 65
					obsHeight = 55
					obsImage = vultureEnemyImg
				} else if (randType > 0.25) {
					obstacleType = 'cactus-cluster'
					obsWidth = 85
					obsHeight = 70
					obsImage = cactusClusterImg
				}

				return {
					id: Date.now() + Math.random() * 10000,
					type: obstacleType,
					laneIndex: laneIdx,
					y: -100,
					vy: 2.2 + Math.floor(scoreRef.current / 4000), // Adjusted divisor for a much more gradual speed increase
					width: obsWidth,
					height: obsHeight,
					image: obsImage,
				}
			})

			setObstacles((prev) => [...prev, ...newObstacles])
		}, 700)

		return () => clearInterval(spawnInterval)
	}, [isGameOn])

	// Input Handling: "S" or ArrowDown for Duck, A/D/Arrows for Lanes
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isPausedRef.current) return

			if (e.code === 'KeyS' || e.code === 'ArrowDown') {
				e.preventDefault()
				setIsDucking(true)
			}
			if (['ArrowLeft', 'KeyA'].includes(e.code)) {
				setCurrentLane((prev) => Math.max(0, prev - 1))
			}
			if (['ArrowRight', 'KeyD'].includes(e.code)) {
				setCurrentLane((prev) => Math.min(2, prev + 1))
			}
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === 'KeyS' || e.code === 'ArrowDown') {
				setIsDucking(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	// Physics Loop & Forgiving Collision Detection (Fixed Ground Position)
	useEffect(() => {
		if (!isGameOn || playableAreaSize.height === 0) return

		let animationFrameId: number
		const defaultGroundY = playableAreaSize.height - 140

		const gameLoop = () => {
			if (!isPaused) {
				setObstacles((prev) => {
					const nextObstacles: Obstacle[] = []
					const playerX = getLaneX(currentLane)
					const playerY = defaultGroundY

					prev.forEach((obs) => {
						const nextY = obs.y + obs.vy
						const obsX = getLaneX(obs.laneIndex)
						const isSameLane = obs.laneIndex === currentLane

						let isColliding = false

						if (isSameLane) {
							const basicOverlap =
								playerX + heroWidth * 0.20 < obsX + obs.width * 0.80 &&
								playerX + heroWidth * 0.80 > obsX + obs.width * 0.20 &&
								playerY + heroHeight * 0.20 < nextY + obs.height * 0.80 &&
								playerY + heroHeight * 0.80 > nextY + obs.height * 0.20

							if (basicOverlap) {
								const isVulture = obs.type === 'vulture'

								if (isVulture && isDucking) {
									isColliding = false
								} else {
									isColliding = true
								}
							}
						}

						if (isColliding) {
							setLives((l) => {
								const updatedLives = l - 1
								if (updatedLives <= 0) {
									setIsGameOn(false)
									setIsGameOver(true)
								}
								return updatedLives
							})
						} else if (nextY < playableAreaSize.height + 50) {
							nextObstacles.push({ ...obs, y: nextY })
						}
					})

					return nextObstacles
				})
			}

			animationFrameId = requestAnimationFrame(gameLoop)
		}

		animationFrameId = requestAnimationFrame(gameLoop)
		return () => cancelAnimationFrame(animationFrameId)
	}, [isGameOn, isPaused, playableAreaSize.height, heroHeight, currentLane, isDucking])

	// High Score Storage
	useEffect(() => {
		if (isGameOver) {
			const currentHighScore = parseInt(localStorage.getItem('ostrich_high_score') || '6398', 10)
			if (score > currentHighScore) {
				localStorage.setItem('ostrich_high_score', score.toString())
			}
			if (submitScore) submitScore(score)
		}
	}, [isGameOver, score, submitScore])

	const handleStartGame = () => {
		setIsGameOver(false)
		setIsPaused(false)
		setIsGameOn(true)
		setScore(0)
		setLives(3)
		setObstacles([])
		setCurrentLane(1)
	}

	const handleResumeGame = () => {
		setIsPaused(false)
	}

	const getCurrentHeroImage = () => {
		if (isDucking) return ostrichDuckImg

		const runFrames = [ostrichRun0, ostrichRun1, ostrichRun2, ostrichRun3]
		return runFrames[runFrame]
	}

	const defaultGroundY = playableAreaSize.height > 0 ? playableAreaSize.height - 140 : 300

	return (
		<GameStatusContext.Provider value={{ isGameOn }}>
			<div id="ostrich-game-frame">
				<div className="frame-corner top-left"></div>
				<div className="frame-corner top-right"></div>
				<div className="frame-corner bottom-left"></div>
				<div className="frame-corner bottom-right"></div>

				<div
					id="playable-area-OstrichRun"
					ref={playableAreaRef}
				>
					{/* Vertical Running Lanes */}
					<div className="vertical-lanes-container">
						<div className={`lane ${currentLane === 0 ? 'active-lane' : ''}`}></div>
						<div className={`lane ${currentLane === 1 ? 'active-lane' : ''}`}></div>
						<div className={`lane ${currentLane === 2 ? 'active-lane' : ''}`}></div>
					</div>

					{!isGameOn && !isGameOver && (
						<div id="title-container">
							<h1 className="game-title">OSTRICH RUN</h1>
							<p className="game-subtitle">A/D / ARROWS: LANES | S / ↓: DUCK (VULTURES)</p>
						</div>
					)}

					<div id="hud-left">
						<div className="hud-box lives-box">
							<span className="hud-label">LIVES</span>
							<div className="hearts-container">
								{Array.from({ length: 3 }).map((_, i) => (
									<span key={i} className={`heart ${i < lives ? 'filled' : 'empty'}`}>
										♥
									</span>
								))}
							</div>
						</div>

						<div className="hud-box score-box">
							<span className="hud-label">SCORE</span>
							<span className="hud-value">{score}</span>
						</div>
					</div>

					{isGameOn && playableAreaSize.width > 0 && (
						<>
							{/* Main Character Positioned by Lane */}
							<div
								className="game-entity"
								style={{
									left: getLaneX(currentLane),
									top: defaultGroundY,
									width: heroWidth,
									height: heroHeight,
									backgroundImage: `url(${getCurrentHeroImage()})`,
									transition: 'left 0.12s ease-out',
								}}
							/>

							{/* Obstacles Spawning in Vertical Lanes */}
							{obstacles.map((obs) => (
								<div
									key={obs.id}
									className={`game-entity ${obs.type === 'vulture' ? 'vulture-bobbing' : ''}`}
									style={{
										left: getLaneX(obs.laneIndex),
										top: obs.y,
										width: obs.width,
										height: obs.height,
										backgroundImage: `url(${obs.image})`,
									}}
								/>
							))}
						</>
					)}

					{(!isGameOn || isPaused) && (
						<div id="overlay-screen">
							{isGameOver ? (
								<div className="modal-content">
									<h2>GAME OVER</h2>
									<p className="final-score">FINAL SCORE: {score}</p>
									<GameButton onClick={handleStartGame} text="TRY AGAIN" />
								</div>
							) : isPaused ? (
								<div className="modal-content">
									<h2>PAUSED</h2>
									<GameButton onClick={handleResumeGame} text="RESUME" />
								</div>
							) : (
								<div className="modal-content">
									<GameButton onClick={handleStartGame} text="START RUN" />
								</div>
							)}
						</div>
					)}

					<div id="tagline-banner">
						<span>SWITCH LANES TO AVOID CACTI. S OR ↓ TO DUCK VULTURES!</span>
					</div>
				</div>
			</div>
		</GameStatusContext.Provider>
	)
}