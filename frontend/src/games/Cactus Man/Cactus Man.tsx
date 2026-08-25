import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import './Cactus Man.css'

// Components
import GameButton from "./components/GameButton"

// Assets
import cactusHeroImage from "./assets/cactus_hero.png"
import needleImage from "./assets/cactus_needle.png"
import scorpionRedImage from "./assets/scorpion_red.png"
import goblinSpikyImage from "./assets/goblin_spiky.png"

const START_TIME_S = 60
const BASE_GRAVITY = 0.45
const BONUS_PER_LIFE = 200

type GameStatusContextType = {
    isGameOn: boolean
}

const GameStatusContext = createContext<GameStatusContextType | null>(null)

function useGameStatus() {
    const gameStatusContext = useContext(GameStatusContext)
    if (!gameStatusContext) {
        throw new Error("GameStatusContext is null")
    }
    return gameStatusContext
}

type EntityProps = {
    id: string
    className?: string
    pos?: { x: number; y: number }
    image?: string
    style?: React.CSSProperties
    onClick?: () => void
}

function Entity({ id, className = '', pos = { x: 0, y: 0 }, image, style, onClick }: EntityProps) {
    const safeX = pos?.x ?? 0
    const safeY = pos?.y ?? 0

    return (
        <div
            id={id}
            className={`entity ${className}`}
            onClick={onClick}
            style={{
                left: safeX,
                top: safeY,
                ...(image ? { backgroundImage: `url(${image})` } : {}),
                ...style,
            }}
        />
    )
}

function CactusHero({ pos }: { pos: { x: number; y: number } }) {
    return <Entity id="cactus-hero" className="entity-hero" pos={pos} image={cactusHeroImage} />
}

function ScorpionRed({ pos }: { pos: { x: number; y: number } }) {
    return <Entity id="scorpion-red" className="entity-scorpion" pos={pos} image={scorpionRedImage} />
}

function GoblinSpiky({ pos }: { pos: { x: number; y: number } }) {
    return <Entity id="goblin-spiky" className="entity-goblin" pos={pos} image={goblinSpikyImage} />
}

type Projectile = {
    id: number
    x: number
    y: number
    vx: number
}

type Enemy = {
    id: number
    type: 'scorpion' | 'goblin'
    x: number
    y: number
    vx: number
    width: number
    height: number
}

type Coin = {
    id: number
    x: number
    y: number
    vx: number
    size: number
}

type TimerProps = {
    onTimerEnd: () => void
    isPaused: boolean
}

function Timer({ onTimerEnd, isPaused }: TimerProps) {
    const [timeSeconds, setTimeSeconds] = useState(START_TIME_S)
    const { isGameOn } = useGameStatus()

    useEffect(() => {
        if (!isGameOn || isPaused) return

        const interval = setInterval(() => setTimeSeconds((prev) => prev - 1), 1000)
        return () => clearInterval(interval)
    }, [isGameOn, isPaused])

    useEffect(() => {
        if (timeSeconds === 0) {
            onTimerEnd()
            setTimeSeconds(START_TIME_S)
        }
    }, [timeSeconds, onTimerEnd])

    return <>Time: {timeSeconds}s</>
}

type CactusManProps = {
    submitScore: (score: number) => void
}

export default function CactusMan({ submitScore }: CactusManProps) {
    const [score, setScore] = useState(0)
    const [playableAreaSize, setPlayableAreaSize] = useState({ width: 0, height: 0 })
    const [isGameOn, setIsGameOn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isTabPaused, setIsTabPaused] = useState(false)
    const [lives, setLives] = useState(3)

    // Player vertical position & physics refs
    const [playerY, setPlayerY] = useState(300)
    const playerVelY = useRef(0)
    const isGrounded = useRef(false)

    const [projectiles, setProjectiles] = useState<Projectile[]>([])
    const [enemies, setEnemies] = useState<Enemy[]>([])
    const [coins, setCoins] = useState<Coin[]>([])

    const playableAreaRef = useRef<HTMLDivElement | null>(null)

    // Handle tab visibility change (pause game when switching tabs)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isGameOn && !isGameOver) {
                setIsTabPaused(true)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [isGameOn, isGameOver])

    // Responsive element sizing: significantly smaller footprint on narrow screens
    const heroSize = Math.min(Math.max(42, playableAreaSize.width * 0.06), 110)
    const enemySize = Math.min(Math.max(50, playableAreaSize.width * 0.08), 140)
    const coinSize = Math.min(Math.max(24, playableAreaSize.width * 0.03), 45)

    // Responsive hero X offset: hugs the left border tightly on mobile, further out on desktop
    const fixedHeroX = Math.min(Math.max(16, playableAreaSize.width * 0.04), 80)

    // Check if the current display counts as a smaller screen (e.g., width < 768px)
    const isSmallScreen = playableAreaSize.width > 0 && playableAreaSize.width < 768

    // Adjusted gravity for smaller screens (balanced to avoid feeling overly heavy)
    const currentGravity = isSmallScreen ? 0.48 : BASE_GRAVITY

    // Dynamic speed scaling: slightly reduced enemy speed on smaller screens
    const dynamicSpeed = playableAreaSize.width > 0 
        ? -Math.max(2.0, playableAreaSize.width * (isSmallScreen ? 0.0035 : 0.0045)) 
        : -5

    // Precise coin spawn height boundaries
    const maxBaseHeight = playableAreaSize.height > 0 ? Math.min(90, playableAreaSize.height * 0.16) : 90
    const minBaseHeight = playableAreaSize.height > 0 ? Math.min(35, playableAreaSize.height * 0.07) : 35

    // Screen-aware target jump height (boosted slightly more on small screens for better air time)
    const screenBufferBonus = isSmallScreen ? 115 : 130
    const targetJumpHeight = maxBaseHeight + coinSize + screenBufferBonus

    const dynamicJumpForce = playableAreaSize.height > 0
        ? -Math.min(29, Math.max(14, Math.sqrt(2 * currentGravity * targetJumpHeight)))
        : -19

    // Resize observer to get board bounds
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

    // Enemy Spawner
    useEffect(() => {
        if (!isGameOn || isTabPaused || playableAreaSize.width === 0) return

        const groundY = playableAreaSize.height - (heroSize + 16)

        const spawnInterval = setInterval(() => {
            const isScorpion = Math.random() > 0.5
            const newEnemy: Enemy = {
                id: Date.now(),
                type: isScorpion ? 'scorpion' : 'goblin',
                x: playableAreaSize.width,
                y: groundY + (heroSize - enemySize),
                vx: dynamicSpeed,
                width: enemySize,
                height: enemySize,
            }
            setEnemies((prev) => [...prev, newEnemy])
        }, 2500)

        return () => clearInterval(spawnInterval)
    }, [isGameOn, isTabPaused, playableAreaSize, heroSize, enemySize, dynamicSpeed])

    // Coin Spawner
    useEffect(() => {
        if (!isGameOn || isTabPaused || playableAreaSize.width === 0 || playableAreaSize.height === 0) return

        const groundY = playableAreaSize.height - (heroSize + 16)

        const coinInterval = setInterval(() => {
            const clusterCount = Math.floor(Math.random() * 3) + 1
            const isHighTier = Math.random() > 0.4
            
            const baseHeight = isHighTier ? maxBaseHeight : minBaseHeight
            const elevatedY = groundY - baseHeight

            const newCoins: Coin[] = []
            const now = Date.now()

            for (let i = 0; i < clusterCount; i++) {
                newCoins.push({
                    id: now + i,
                    x: playableAreaSize.width + i * (coinSize * 1.5),
                    y: elevatedY,
                    vx: dynamicSpeed,
                    size: coinSize,
                })
            }

            setCoins((prev) => [...prev, ...newCoins])
        }, 1500)

        return () => clearInterval(coinInterval)
    }, [isGameOn, isTabPaused, playableAreaSize, heroSize, coinSize, dynamicSpeed, maxBaseHeight, minBaseHeight])

    // Jump Handler Function
    const triggerJump = () => {
        if (isTabPaused) return
        if (isGrounded.current) {
            playerVelY.current = dynamicJumpForce
            isGrounded.current = false
        }
    }

    // Shoot Handler Function
    const triggerShoot = () => {
        if (!isGameOn || isTabPaused) return
        setProjectiles((prev) => [
            ...prev,
            {
                id: Date.now(),
                x: fixedHeroX + heroSize * 0.7,
                y: playerY + heroSize * 0.2,
                vx: Math.max(8, playableAreaSize.width * 0.012),
            },
        ])
    }

    // Jump Input Handling via Keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault()
                triggerJump()
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                if (playerVelY.current < -4) {
                    playerVelY.current = -4
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [dynamicJumpForce, isTabPaused])

    // Fire projectiles on background click
    function handleAreaClick(e: React.MouseEvent) {
        if (!isGameOn || isTabPaused) return

        if ((e.target as HTMLElement).closest('#hud-container, #start-screen, #gameover-screen, #mobile-control-pad, #pause-overlay')) {
            return
        }

        triggerShoot()
    }

    // Physics Loop
    useEffect(() => {
        if (!isGameOn || isTabPaused || playableAreaSize.height === 0) return

        let animationFrameId: number

        const gameLoop = () => {
            const groundY = playableAreaSize.height - (heroSize + 16)

            // 1. Gravity & Jump Physics (with apex float assistance on small screens)
            setPlayerY((prevY) => {
                let newY = prevY + playerVelY.current

                if (newY >= groundY) {
                    newY = groundY
                    playerVelY.current = 0
                    isGrounded.current = true
                } else {
                    isGrounded.current = false
                    const effectiveGravity = (isSmallScreen && playerVelY.current < 0 && playerVelY.current > -3) 
                        ? currentGravity * 0.7 
                        : currentGravity

                    playerVelY.current += effectiveGravity
                }

                return newY
            })

            // 2. Enemy Collision
            setEnemies((prevEnemies) => {
                const remainingEnemies: Enemy[] = []

                prevEnemies.forEach((enemy) => {
                    const nextX = enemy.x + enemy.vx

                    const isCollidingWithHero =
                        fixedHeroX < nextX + enemy.width &&
                        fixedHeroX + heroSize > nextX &&
                        playerY < enemy.y + enemy.height &&
                        playerY + heroSize > enemy.y

                    if (isCollidingWithHero) {
                        setLives((prevLives) => {
                            const newLives = prevLives - 1
                            if (newLives <= 0) {
                                setIsGameOn(false)
                                setIsGameOver(true)
                            }
                            return newLives
                        })
                    } else if (nextX + enemy.width > 0) {
                        remainingEnemies.push({ ...enemy, x: nextX })
                    }
                })

                return remainingEnemies
            })

            // 3. Coin Collision
            setCoins((prevCoins) => {
                const remainingCoins: Coin[] = []

                prevCoins.forEach((coin) => {
                    const nextX = coin.x + coin.vx

                    const isCollected =
                        fixedHeroX < nextX + coin.size &&
                        fixedHeroX + heroSize > nextX &&
                        playerY < coin.y + coin.size &&
                        playerY + heroSize > coin.y

                    if (isCollected) {
                        setScore((s) => s + 30)
                    } else if (nextX + coin.size > 0) {
                        remainingCoins.push({ ...coin, x: nextX })
                    }
                })

                return remainingCoins
            })

            // 4. Projectile Collisions
            setProjectiles((prevProjectiles) => {
                const nextProjectiles: Projectile[] = []

                prevProjectiles.forEach((p) => {
                    const newX = p.x + p.vx
                    let hitEnemy = false

                    setEnemies((prevEnemies) =>
                        prevEnemies.filter((e) => {
                            const isColliding =
                                newX > e.x &&
                                newX < e.x + e.width &&
                                p.y > e.y &&
                                p.y < e.y + e.height

                            if (isColliding) {
                                hitEnemy = true
                                setScore((s) => s + 10)
                                return false
                            }
                            return true
                        })
                    )

                    if (!hitEnemy && newX < playableAreaSize.width) {
                        nextProjectiles.push({ ...p, x: newX })
                    }
                })

                return nextProjectiles
            })

            animationFrameId = requestAnimationFrame(gameLoop)
        }

        animationFrameId = requestAnimationFrame(gameLoop)
        return () => cancelAnimationFrame(animationFrameId)
    }, [isGameOn, isTabPaused, playableAreaSize, heroSize, playerY, fixedHeroX, currentGravity, isSmallScreen])

    // Submit total score on Game Over
    useEffect(() => {
        if (isGameOver) {
            const remainingLivesBonus = Math.max(0, lives) * BONUS_PER_LIFE
            submitScore(score + remainingLivesBonus)
        }
    }, [isGameOver, submitScore, score, lives])

    function StartScreen() {
        return (
            <div id="start-screen">
                <h1>CACTUS MAN</h1>
                <h2>ENDLESS RUNNER</h2>
                <GameButton onClick={() => setIsGameOn(true)} text="RUN & SAVE THE KINGDOM!" />
                <p>Space / Up Arrow / W to Jump | Left Click to Shoot Needles</p>
            </div>
        )
    }

    function GameOverScreen() {
        const activeLives = Math.max(0, lives)
        const livesBonus = activeLives * BONUS_PER_LIFE
        const totalScore = score + livesBonus

        return (
            <div id="gameover-screen">
                <h1>GAME OVER</h1>

                <div className="score-breakdown-box">
                    <div className="score-row">
                        <span>Base Score:</span>
                        <span>{score}</span>
                    </div>
                    <div className="score-row bonus-row">
                        <span>Lives Bonus ({activeLives} ❤️ x {BONUS_PER_LIFE}):</span>
                        <span>+{livesBonus}</span>
                    </div>
                    <div className="score-row total-row">
                        <span>Total Score:</span>
                        <span>{totalScore}</span>
                    </div>
                </div>

                <GameButton
                    onClick={() => {
                        setIsGameOver(false)
                        setIsGameOn(true)
                        setScore(0)
                        setLives(3)
                        setEnemies([])
                        setCoins([])
                        setProjectiles([])
                        setPlayerY(300)
                        playerVelY.current = 0
                    }}
                    text="Play again"
                />
            </div>
        )
    }

    function PauseOverlay() {
        return (
            <div id="pause-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
                color: '#fff',
                fontFamily: 'inherit',
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>GAME PAUSED</h1>
                <GameButton onClick={() => setIsTabPaused(false)} text="RESUME GAME" />
            </div>
        )
    }

    function handleOnTimerEnd() {
        setIsGameOn(false)
        setIsGameOver(true)
    }

    const isAreaReady = playableAreaSize.width > 0 && playableAreaSize.height > 0

    return (
        <GameStatusContext.Provider value={{ isGameOn }}>
            <div id="game-container-wrapper">
                <div
                    id="playable-area-CactusMan"
                    className={isGameOn && !isTabPaused ? 'scrolling' : ''}
                    ref={playableAreaRef}
                    onClick={handleAreaClick}
                    style={{ position: 'relative' }}
                >
                    <div id="hud-container">
                        <div id="score-lives-container">
                            <span>Score: {score}</span>
                            <span id="hud-lives">
                                Lives: {'❤️'.repeat(Math.max(0, lives))}
                            </span>
                        </div>
                        <span id="hud-timer">
                            <Timer onTimerEnd={handleOnTimerEnd} isPaused={isTabPaused} />
                        </span>
                    </div>

                    {isGameOn ? (
                        isAreaReady && (
                            <>
                                <CactusHero pos={{ x: fixedHeroX, y: playerY }} />

                                {enemies.map((e) =>
                                    e.type === 'scorpion' ? (
                                        <ScorpionRed key={e.id} pos={{ x: e.x, y: e.y }} />
                                    ) : (
                                        <GoblinSpiky key={e.id} pos={{ x: e.x, y: e.y }} />
                                    )
                                )}

                                {coins.map((c) => (
                                    <Entity
                                        key={c.id}
                                        id={`coin-${c.id}`}
                                        className="entity-coin"
                                        pos={{ x: c.x, y: c.y }}
                                    />
                                ))}

                                {projectiles.map((p) => (
                                    <Entity
                                        key={p.id}
                                        id={`needle-${p.id}`}
                                        className="entity-needle"
                                        pos={{ x: p.x, y: p.y }}
                                        image={needleImage}
                                    />
                                ))}

                                {isTabPaused && <PauseOverlay />}
                            </>
                        )
                    ) : (
                        <>{isGameOver ? <GameOverScreen /> : <StartScreen />}</>
                    )}
                </div>

                {/* Dedicated external Mobile Control Pad placed strictly below the game field */}
                {isGameOn && (
                    <div id="mobile-control-pad" onClick={(e) => e.stopPropagation()}>
                        <button className="mobile-btn jump-btn" onClick={triggerJump}>
                            ⬆️ JUMP
                        </button>
                        <button className="mobile-btn shoot-btn" onClick={triggerShoot}>
                            🌵 SHOOT
                        </button>
                    </div>
                )}
            </div>
        </GameStatusContext.Provider>
    )
}