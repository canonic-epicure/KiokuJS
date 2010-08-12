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
        
        
        collapse : function (node, collapser) {
            var props = {}
            
            Joose.O.eachOwn(node.object, function (value, name) {
                props[ name ] = collapser.visit(value)
            })
            
            return {
                source  : Function.prototype.toString.call(node.object),
                
                props   : props
            }
        },
        
        
        clearInstance : function (node) {
            var func = node.object
            
            Joose.O.eachOwn(func, function (value, name) {
                
                delete func[ name ]
            })
            
            delete node.objectData.action
        },
        
        
        createEmptyInstance : function (node) {
            var closure = node.objectData = {
                action : null
            }
            
            return function () {
                return closure.action.apply(this, arguments)
            }
        },
        
        
        populate : function (node, expander) {
            
            var func = node.object
            
            Joose.O.each(node.data.props, function (value, name) {
                
                func[ name ] = expander.visit(value)
            })
            
            node.objectData.action = eval('var a = ' + node.data.source + '; a')
        }
    }

})
