Role('KiokuJS.Feature.Attribute.Lazy', {
    
    does    : 'KiokuJS.Aspect.AfterCollapse',
    
    
    
    after : {
        
        afterCollapse : function (instance, value) {
            
            if (value instanceof KiokuJS.Node) value.lazy = true
        }
    },
    
    
    override : {
        
//        getGetter : function () {
//            var original    = this.SUPER()
//            var lazy        = this.lazy
//            
//            if (!lazy) return original
//            
//            var me      = this    
//            var slot    = this.slot    
//            
//            return function () {
//                if (!me.hasValue(this)) {
//                    var initializer = typeof lazy == 'function' ? lazy : this[ lazy.replace(/^this\./, '') ]
//                    
//                    me.setValueTo(this, initializer.call(this, me))
//                }
//                
//                return original.call(this)    
//            }
//        },
//        
//        
//        getSetter : function () {
//        }
    }
})
