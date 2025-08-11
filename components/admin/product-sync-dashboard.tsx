"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  RefreshCw, 
  ShoppingBag, 
  TrendingUp, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react'

interface SyncStatus {
  retailer: string
  statu