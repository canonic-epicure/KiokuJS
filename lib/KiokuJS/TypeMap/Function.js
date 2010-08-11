Class('KiokuJS.TypeMap.Function', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
    has : {
        forClass    : 'Function'
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Function'
        },
        
        
        collapse : function (instance, node, collapser) {
            var props = {}
            
            Joose.O.eachOwn(instance, function (value, name) {
                props[ name ] = collapser.visit(value)
            })
            
            return {
                source  : Function.prototype.toString.call(instance),
                
                props   : props
            }
        },
        
        
        clear : function (instance, node) {
            Joose.O.eachOwn(instance, function (value, name) {
                
                delete instance.func[ name ]
            })
            
            delete instance.closure.func
        },
        
        
        createEmptyInstance : function (node) {
            var closure = {}
            
            return {
                closure     : closure,
                
                func        : function () {
                    return closure.func.apply(this, arguments)
                }
            }
        },
        
        
        populate : function (instance, node, expander) {
            
            var func = instance.func
            
            Joose.O.each(node.data.props, function (value, name) {
                
                func[ name ] = expander.visit(value)
            })
            
            instance.closure.func = eval('var a = ' + node.data.source + '; a')
            
            return instance
        },
        
        
        getInstance : function (object, node) {
            return object.func
        }
    }

})
